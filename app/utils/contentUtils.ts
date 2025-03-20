export const extractSideBarLinks = (page: { value: { body: { toc: { links: any; }; }; }; }) => {
    return (page.value.body?.toc?.links || [])
      .filter((toc: { depth: number; }) => toc.depth === 3)
      .map((toc: { text: string; }) => ({
        ...toc,
        text: toc.text?.trim(),
      }));
  };