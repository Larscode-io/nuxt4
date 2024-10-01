// api/jaarverslagen.js
import { useFileMakerPublications } from "./useFileMakerPublications";

export default defineEventHandler(async (event) => {
  const { filemakerToken: token, filemakerTokenExpiration: tokenExpiration } =
    event.context;

  try {
    const { fetchPublications } = useFileMakerPublications(
      token,
      tokenExpiration
    );
    const result = await fetchPublications("jaarverslagen");

    return result;
  } catch (error) {
    console.error(error.message || "Error in persberichten API");
    return {
      status: "error",
      code: 401,
      message:
        error.message || "An error occurred while processing the request",
    };
  }
});
