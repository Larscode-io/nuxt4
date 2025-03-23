export const extractSideBarLinks = (page: { value: { body: { toc: { links: any; }; }; }; }) => {
    const links = (page.value.body?.toc?.links || [])
      .filter((toc: { depth: number; }) => toc.depth === 3)
      .map((toc: { text: string; }) => ({
        ...toc,
        text: toc.text ? toc.text.split('.').slice(1).join('.').trim() || toc.text.trim() : '',      }));
    console.log(links);
    return links;
  };