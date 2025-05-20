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
  roles?: Role[] | Role
  usStartDate?: Date | null
}
export type Role = {
  role: string
  startDate: string | null
  endDate: string | null
}
