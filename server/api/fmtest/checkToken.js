import { useRuntimeConfig, defineEventHandler, getQuery } from "#imports";

// https://github.com/unjs/ofetch?tab=readme-ov-file : Allow self-signed certificates
import { ofetch } from "ofetch";
import { Agent } from "undici";
const unsecureAgent = new Agent({ connect: { rejectUnauthorized: false } });
const unsecureFetch = ofetch.create({ dispatcher: unsecureAgent });

export default defineEventHandler(async (event) => {
  const { auServername, auDatabase, auUsername, auPassword } =
    useRuntimeConfig();

  if (!auServername || !auDatabase || !auUsername || !auPassword) {
    console.error("FileMaker environment variables are not set.");
  }

  const { token } = getQuery(event);
  if (!token) {
    return {
      status: "error",
      code: 401,
      message: "No token received.",
    };
  }
  const url = `https://${auServername}/fmi/data/v1/databases/${auDatabase}/layouts`;

  async function fetchData(fetchFn) {
    try {
      const response = await fetchFn(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      });
      if (!response.messages?.[0]) {
        return {
          status: "error",
          code: 401,
          message: "Fetched layouts from database but the response is empty",
        };
      }
      if (
        response.messages[0].code !== "0" ||
        response.messages[0].message !== "OK"
      ) {
        return {
          status: "error",
          code: 401,
          message: "Fetched layouts from database but the response is not OK",
        };
      }
      return {
        status: "success",
        code: 200,
        message: "Data fetched successfully",
        data: { messages: response.messages, layouts: "removed" },
      };
    } catch (error) {
      if (error.name === "FetchError") {
        if (
          error.cause?.message === "This operation was aborted" &&
          error.cause?.code === 20
        ) {
          return {
            status: "error",
            code: 500,
            message: "Our request timed out",
            data: null,
          };
        } else if (
          error.cause?.cause?.code === "CERT_HAS_EXPIRED" &&
          error.cause?.cause?.message === "certificate has expired"
        ) {
          return {
            status: "error",
            code: 500,
            message: "The certificate has expired",
            data: null,
          };
        }
      }
      console.error("Detailed error:", error);
      return {
        status: "error",
        code: 500,
        message: "Failed to connect to FileMaker database",
        data: null,
        error,
      };
    }
  }

  try {
    let result = await fetchData($fetch);

    if (result.status === "error" && result.message.includes("certificate")) {
      console.error("Fallback to unsecureFetch due to SSL error");
      result = await fetchData(unsecureFetch);
    }

    return result;
  } catch (error) {
    console.error("renewToken(): ", error.message);
    throw error;
  }
});
