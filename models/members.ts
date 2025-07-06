export type Infos = {
  de: string[]
  en: string[]
  fr: string[]
  nl: string[]
}

export type Alt = {
  de: string
  en: string
  fr: string
  nl: string
}

export type Member = {
  name: string
  slug?: string
  isAlive?: boolean
  startDate: string | null
  endDate: string | null
  lang: string
  picture?: string
  femaleTitle?: boolean
  alt?: {
    en?: string
    fr?: string
    nl?: string
    de?: string
  }
  infos?: {
    en?: string[]
    fr?: string[]
    nl?: string[]
    de?: string[]
  }
  roles: Role[] | Role
  // helper attribute to avoid recalculating the most recent role too often
  mostRecentRole?: Role
  usStartDate?: Date | null
}
export type Role = {
  role: string
  startDate: string | null
  endDate: string | null
}

export type PageContent = {
  title: string
  description?: string
  locale?: string
  posterUrl?: string
  body: {
    toc: TocLink
    children: []
    type: 'root' | 'section' | 'paragraph' | 'text' | 'image' | 'video' | 'list' | 'table'
  }
  _id: string
  _path: string
  _locale: string
  _type?: string
  _updatedAt?: string
  _createdAt?: string
  _draft?: boolean
  _draftOf?: string
}

export type TocLink = {
  id: string
  depth: number
  text: string
  links?: TocLink[]
}
