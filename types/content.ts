export type PageContent = {
  title: string;
  description?: string;
  locale?: string;
  posterUrl?: string;
  body: {
    toc: {
      links: any;
    };
  };
}
