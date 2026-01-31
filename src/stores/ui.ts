// UI translations loaded from separate ui.json file
import { derived } from 'svelte/store';
import { language } from './language';
import { udlData } from './udlData';
import uiTranslations from '../data/ui.json';

// Derived store that provides UI translations based on current language
export const ui = derived([language, udlData], ([$language, $udlData]) => {
  const terminology = $udlData.terminology || {};

  return {
    // Navigation
    home: uiTranslations.navigation.home[$language],
    back: uiTranslations.navigation.back[$language],
    backToExplorer: uiTranslations.navigation.backToExplorer[$language],
    viewCompleteModel: uiTranslations.navigation.viewCompleteModel[$language],
    exploreGuidelines: uiTranslations.navigation.exploreGuidelines[$language],

    // Version
    versionLabel: uiTranslations.labels.versionLabel[$language],

    // Buttons
    clearFilters: uiTranslations.buttons.clearFilters[$language],

    // Labels (UI-specific)
    filters: uiTranslations.labels.filters[$language],
    appTitle: uiTranslations.labels.appTitle[$language],
    allPrinciples: uiTranslations.labels.allPrinciples[$language],
    allGuidelines: uiTranslations.labels.allGuidelines[$language],
    allConsiderations: uiTranslations.labels.allConsiderations[$language],
    allTypes: uiTranslations.labels.allTypes[$language],
    results: uiTranslations.labels.results[$language],
    result: uiTranslations.labels.result[$language],

    // Model terminology (from udl.json)
    guideline: terminology.guideline?.[$language] || 'Guideline',
    guidelines: terminology.guidelines?.[$language] || 'Guidelines',
    consideration: terminology.consideration?.[$language] || 'Consideration',
    considerations: terminology.considerations?.[$language] || 'Considerations',
    principle: terminology.principle?.[$language] || 'Principle',
    principles: terminology.principles?.[$language] || 'Principles',

    // Home page
    whatIsUDL: uiTranslations.home.whatIsUDL[$language],
    udlDescription: uiTranslations.home.udlDescription[$language],
    udlPrinciples: uiTranslations.home.udlPrinciples[$language],
    engagementWhy: uiTranslations.home.engagementWhy[$language],
    representationWhat: uiTranslations.home.representationWhat[$language],
    actionExpressionHow: uiTranslations.home.actionExpressionHow[$language],

    // Messages
    noResults: uiTranslations.messages.noResults[$language],
    itemNotFound: uiTranslations.messages.itemNotFound[$language],

    // Visibility Toggle
    showConsiderations: uiTranslations.labels.showConsiderations[$language],
    hideConsiderations: uiTranslations.labels.hideConsiderations[$language],
    viewOptions: uiTranslations.labels.viewOptions[$language],

    // Simple Actions
    viewAction: uiTranslations.labels.viewAction[$language],
    searchAction: uiTranslations.labels.searchAction[$language],
    showAction: uiTranslations.labels.showAction[$language],
    hideAction: uiTranslations.labels.hideAction[$language],
    modelAction: uiTranslations.labels.modelAction[$language],
  };
});
