// Type definitions for UDL data structure

export interface MultilingualText {
  es: string;
  en: string;
  eu: string;
  la: string;
}

export type Language = 'es' | 'en' | 'eu' | 'la';

export interface Consideration {
  id: string;
  code: string;
  color?: string;
  description: MultilingualText;
}

export interface Guideline {
  id: string;
  code: string;
  row: MultilingualText;
  color?: string;
  preDescription?: MultilingualText;
  name: MultilingualText;
  considerations: Consideration[];
}

export interface Principle {
  id: string;
  color?: string;
  preDescription?: MultilingualText;
  name: MultilingualText;
  guidelines: Guideline[];
}

export interface Network {
  id: string;
  color?: string;
  name: MultilingualText;
  why?: MultilingualText;
  what?: MultilingualText;
  how?: MultilingualText;
  description: MultilingualText;
  principle: Principle;
}

export interface UDLData {
  title: MultilingualText;
  author: string;
  year: number;
  goal: MultilingualText;
  whatIsUDL?: MultilingualText;
  udlDescription?: MultilingualText;
  udlPrinciples?: MultilingualText;
  networks: Network[];
  terminology?: any; // Model-specific terminology
  appVersion?: string;
}

export interface UDLRoot {
  udl: UDLData;
}

// Indexed data for fast lookups
export interface UDLIndex {
  networks: Map<string, Network>;
  principles: Map<string, Principle>;
  guidelines: Map<string, Guideline>;
  considerations: Map<string, Consideration>;
}

// Search result types
export interface SearchResult {
  id: string;
  code: string;
  type: 'principle' | 'guideline' | 'consideration';
  principleId: string;
  guidelineId?: string;
  item: Principle | Guideline | Consideration;
  principleName?: MultilingualText;
  guidelineName?: MultilingualText;
}
