const apiUrl = "http://localhost:3000";

export async function fetchMultipleByPaths(paths: any[]) {
  try {
    const docs = await Promise.all(
      paths.map(async (path) => {
        try {
          const doc = await queryContent(path).findOne();
          return doc;
        } catch (error) {
          console.error(`Error fetching document at path: ${path}`, error);
          return null;
        }
      })
    );
    return docs.filter((doc) => doc !== null);
  } catch (error) {
    console.error("Error fetching multiple documents:", error);
    return [];
  }
}

// Custom fetch function implemented to centralize fetch related logic
export const cFetch = (
  url: string,
  method: "GET" | "PUT" | "POST" | "DELETE" = "GET",
  options = {}
) => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiBaseUrl || "";

  console.log("config.public.apiBaseUrl: ", config.public.apiBaseUrl);

  console.log(`${apiUrl}${url}`);
  return useFetch(`${apiUrl}${url}`, {
    method,
    ...options,
  });
};

// Convenience methods
export const cGet = (url: string, options = {}) => {
  return cFetch(url, "GET", options);
};

export const cPost = (url: string, body: any, options = {}) => {
  return cFetch(url, "POST", { body, ...options });
};

export const cPut = (url: string, body: any, options = {}) => {
  return cFetch(url, "PUT", { body, ...options });
};

export const cDelete = (url: string, options = {}) => {
  return cFetch(url, "DELETE", options);
};
