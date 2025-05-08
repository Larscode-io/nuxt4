// # info: This file defines the types used for content in the application.
export type PageContent = {
  title: string
  description?: string
  locale?: string
  posterUrl?: string
  body: {
    toc: {
      links: any
    }
  }
}
