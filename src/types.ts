// Type definitions for UDL data structure

export interface MultilingualText {
  es: string | string[];
  en: string | string[];
  eu: string | string[];
  la: string | string[];
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
  version: MultilingualText;
  acronym: MultilingualText;
  author: string;
  year: number;
  goal: MultilingualText;
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
  examples: Map<string, Example>;
  activities: Map<string, Activity>;
}

// Search result types
export interface SearchResult {
  id: string;
  code: string;
  type: 'principle' | 'guideline' | 'consideration' | 'example' | 'activity';
  principleId: string;
  guidelineId?: string;
  considerationId?: string;
  item: Principle | Guideline | Consideration | Example | Activity;
  principleName?: MultilingualText;
  guidelineName?: MultilingualText;
  educationalLevel?: MultilingualText;
  curricularArea?: MultilingualText;
}

// Example types
export interface WebTool {
  name: string;
  url: string;
  logo: string;
}

export interface Adaptation {
  text: MultilingualText;
  webTools?: WebTool[];
}

export interface Activity {
  id: string; // "01_PRI_MAT"
  code: string; // "01-PRI-MAT"
  gradeLevel: MultilingualText; // Full name (resolvable)
  subject: MultilingualText; // Full name (resolvable)
  title: MultilingualText;
  duaAdaptations: Record<string, Adaptation>; // Keyed by consideration code (e.g. "7.1")
}

export interface Example {
  id: string;
  code: string;
  color: string;
  educationalLevel: MultilingualText;
  curricularArea: MultilingualText;
  activity: MultilingualText;
  designOptions: MultilingualText;
  webTools: WebTool[];
}

export interface ConsiderationExamples {
  considerationId: string;
  examples: Example[];
}

export interface GuidelineExamples {
  considerations: ConsiderationExamples[];
}
