// Types matching udl-core.json structure

export type Lang = 'es' | 'en' | 'eu' | 'la';
export type Localized = Record<Lang, string>;

export interface Consideration {
  id: string;
  code: string;
  color: string;
  description: Localized;
}

export interface Guideline {
  id: string;
  code: string;
  color: string;
  preDescription: Localized;
  row: Localized;
  name: Localized;
  considerations: Consideration[];
}

export interface Principle {
  id: string;
  color: string;
  preDescription: Localized;
  name: Localized;
  guidelines: Guideline[];
}

export interface Network {
  id: string;
  color: string;
  name: Localized;
  why?: Localized;
  what?: Localized;
  how?: Localized;
  description: Localized;
  principle: Principle;
}

export interface UDLData {
  udl: {
    title: Localized;
    version: Localized;
    acronym: Localized;
    author: string;
    year: number;
    goal: Localized;
    terminology: Record<string, any>;
    networks: Network[];
  };
}

// Video composition props
export interface ConstellationProps {
  lang: Lang;
}

export interface NetworkExplorerProps {
  networkId: string;
  lang: Lang;
}

export interface GuidelineClipProps {
  guidelineCode: string;
  lang: Lang;
}
