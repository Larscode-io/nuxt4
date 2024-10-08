// This is an example of how to fetch data from FileMaker and return it as JSON.

// all the Publicaties_Brochures, Publicaties_Jaarverslagen, Publicaties_Persberichten and Publicaties_Studies are
// refactored with a composable useFileMakerPublicaties

import { FileMakerService } from "../../services/fileMakerService";
import { useRuntimeConfig } from "#nitro";
import { fetchWithFallback, defineEventHandler } from '#imports';

const fieldNames = [
  "filename",
  "new_filename_cu",
  "_k1_Brochure_id",
  "title_n",
  "title_f",
  "title_e",
  "title_d",
  "offline",
];

const mapFields = (data) =>
  data.map(({ fieldData }) =>
    Object.fromEntries(fieldNames.map((field) => [field, fieldData[field]]))
  );

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const fileMakerService = new FileMakerService(config, fetchWithFallback);

  const token = event.context.filemakerToken;
  const tokenExpiration = event.context.filemakerTokenExpiration;

  if (!token) {
    console.error(
      "No token found in the event context, don't forget to include this api url in the middleware in server/middleware/fm.js."
    );
    return {
      status: "error",
      code: 401,
      message: "No token found in the event context...",
    };
  }

  try {
    const {
      response: { dataInfo, data },
      // eslint-disable-next-line no-unused-vars
      messages,
    } = await fileMakerService.getPublicaties_Brochures(token);

    return {
      expires: tokenExpiration,
      ...dataInfo,
      brochures: mapFields(data), // mapFields filters out the fields we don't need
    };
  } catch (error) {
    console.error("Error fetching data from FileMaker:", error);
    throw error;
  }
});

