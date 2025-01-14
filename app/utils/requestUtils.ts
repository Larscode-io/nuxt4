export async function fetchMultipleByPaths(paths: any[]) {
    try {
      const docs = await Promise.all(paths.map(async (path) => {
        try {
          const doc = await queryContent(path).findOne();
          return doc;
        } catch (error) {
          console.error(`Error fetching document at path: ${path}`, error);
          return null;
        }
      }));
      return docs.filter(doc => doc !== null);
    } catch (error) {
      console.error('Error fetching multiple documents:', error);
      return [];
    }
  }