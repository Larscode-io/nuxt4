export type Infos = {
    de: string[];
    en: string[];
    fr: string[];
    nl: string[];
  };
  
  export type Alt = {
    de: string;
    en: string;
    fr: string;
    nl: string;
  };
  
  export type Member = {
    alt: Alt;
    endDate: string;
    infos: Infos;
    lang: string;
    name: string;
    picture: string;
    role: string;
    slug: string;
    startDate: string;
    isAlive: boolean;
    femaleTitle: boolean;
  };