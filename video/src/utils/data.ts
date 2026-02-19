// @ts-ignore - Importing from parent project to avoid duplication
import udlCore from '../../../src/data/json/udl-core.json';
import type { UDLData, Network, Guideline, Consideration, Lang } from '../types';

const data = udlCore as UDLData;

/** Get localized text */
export const t = (localized: Record<string, string>, lang: Lang): string =>
  localized[lang] || localized['en'] || '';

/** Get all networks */
export const getNetworks = (): Network[] => data.udl.networks;

/** Get a single network by ID */
export const getNetwork = (networkId: string): Network | undefined =>
  data.udl.networks.find((n) => n.id === networkId);

/** Get the "why/what/how" label for a network */
export const getNetworkQuestion = (network: Network, lang: Lang): string => {
  if (network.why) return t(network.why, lang);
  if (network.what) return t(network.what, lang);
  if (network.how) return t(network.how, lang);
  return '';
};

/** All guidelines across all networks */
export const getAllGuidelines = (): Guideline[] =>
  data.udl.networks.flatMap((n) => n.principle.guidelines);

/** Find a guideline by its code (e.g. "7", "1", "4") */
export const getGuidelineByCode = (
  code: string
): { guideline: Guideline; network: Network } | undefined => {
  for (const network of data.udl.networks) {
    const guideline = network.principle.guidelines.find((g) => g.code === code);
    if (guideline) return { guideline, network };
  }
  return undefined;
};

/** Get UDL title */
export const getTitle = (lang: Lang): string => t(data.udl.title, lang);

/** Get UDL goal */
export const getGoal = (lang: Lang): string => t(data.udl.goal, lang);

/** Get UDL acronym */
export const getAcronym = (lang: Lang): string => t(data.udl.acronym, lang);

/** Get all consideration codes */
export const getAllConsiderationCodes = (): string[] =>
  data.udl.networks.flatMap((n) =>
    n.principle.guidelines.flatMap((g) => g.considerations.map((c) => c.code))
  );

/** Available languages */
export const LANGUAGES: Lang[] = ['es', 'en', 'eu', 'la'];

/** Language labels */
export const LANGUAGE_LABELS: Record<Lang, string> = {
  es: 'Español',
  en: 'English',
  eu: 'Euskara',
  la: 'Lingua Latina',
};
