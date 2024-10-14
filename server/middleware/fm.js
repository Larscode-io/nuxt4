// server/middleware/fm.js

import { defineEventHandler } from "#imports";
import { fetchWithFallback } from "../utils/fetchWithFallback";
import { useRuntimeConfig } from "#nitro";

// Node version check
const requiredNodeVersion = 18;

if (parseInt(process.versions.node) < requiredNodeVersion) {
  throw new Error(`Node.js version ${requiredNodeVersion}+ required.`);
}

const config = useRuntimeConfig();

// token and tokenExpiration are global so they stay the same for all requests
let token, tokenExpiration;

const getToken = async () => {
  const { auServername, auDatabase, auUsername, auPassword } = config;
  const url = `https://${auServername}/fmi/data/v1/databases/${auDatabase}/sessions`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${auUsername}:${auPassword}`)}`,
    },
    timeout: 5000,
  };

  try {
    const response = await fetchWithFallback(url, options);
    return handleTokenResponse(response, url);
  } catch (error) {
    console.error("Fout bij ophalen token:", error);
    throw error;
  }
};

const handleTokenResponse = (
  { response: { token: newToken }, messages: [{ code, message }] },
  url
) => {
  if (code === "0" || message === "OK") {
    // token and tokenExpiration are global (because they need to stay the same for all requests)
    token = newToken;
    tokenExpiration = Date.now() + 840000; // 14 minutes

    console.info("New token acquired:", token);

    scheduleTokenDeletion(url, token);
    return token;
  } else {
    throw new Error(`Failed to acquire token: ${message}`);
  }
};

const scheduleTokenDeletion = (url) => {
  setTimeout(async () => {
    const deleteOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    };

    try {
      await fetchWithFallback(`${url}/${token}`, deleteOptions);
      console.info("Oude token succesvol verwijderd");
    } catch (error) {
      console.error("Fout bij verwijderen oude token:", error);
    }
  }, 870000); // 14.5 minuten
};

export default defineEventHandler(async (event) => {
  const filemakerRoutePattern =
    /^\/api\/fm\/(?:publications\/(?:persberichten|jaarverslagen|studies|brochures)|example|getArrestDateMinus10|getJuportalData)/;

  if (!filemakerRoutePattern.test(event.node.req.url)) return;

  if (!token || Date.now() > tokenExpiration) {
    await getToken();
  }
  event.context.filemakerToken = token;
  event.context.filemakerTokenExpiration = new Date(
    tokenExpiration
  ).toLocaleTimeString("nl-BE");
});
