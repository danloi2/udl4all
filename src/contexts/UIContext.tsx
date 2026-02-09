import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useLanguage } from './LanguageContext';
import { useUDLData } from './UDLDataContext';
import uiTranslations from '../data/json/ui.json';

interface UIContextType {
  home: string;
  back: string;
  backToExplorer: string;
  viewCompleteModel: string;
  exploreGuidelines: string;
  clearFilters: string;
  filters: string;
  appTitle: string;
  allPrinciples: string;
  allGuidelines: string;
  allConsiderations: string;
  allTypes: string;
  results: string;
  result: string;
  guideline: string;
  guidelines: string;
  consideration: string;
  considerations: string;
  principle: string;
  principles: string;
  whatIsUDL: string;
  udlDescription: string;
  udlPrinciples: string;
  engagementWhy: string;
  representationWhat: string;
  actionExpressionHow: string;
  readyToTeach: string;
  noResults: string;
  itemNotFound: string;
  showConsiderations: string;
  hideConsiderations: string;
  viewOptions: string;
  viewAction: string;
  searchAction: string;
  showAction: string;
  hideAction: string;
  modelAction: string;
  examples: string;
  allExamples: string;
  educationalLevel: string;
  curricularArea: string;
  webTools: string;
  allEducationalLevels: string;
  allCurricularAreas: string;
  udlAcronym: string;
  example: string;
  activity: string;
  designOptions: string;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const { udlData } = useUDLData();

  const ui = useMemo(() => {
    const terminology = udlData.terminology || {};

    return {
      // Navigation
      home: uiTranslations.navigation.home[language],
      back: uiTranslations.navigation.back[language],
      backToExplorer: uiTranslations.navigation.backToExplorer[language],
      viewCompleteModel: uiTranslations.navigation.viewCompleteModel[language],
      exploreGuidelines: uiTranslations.navigation.exploreGuidelines[language],

      // Buttons
      clearFilters: uiTranslations.buttons.clearFilters[language],

      // Labels
      filters: uiTranslations.labels.filters[language],
      appTitle: uiTranslations.labels.appTitle[language],
      allPrinciples: uiTranslations.labels.allPrinciples[language],
      allGuidelines: uiTranslations.labels.allGuidelines[language],
      allConsiderations: uiTranslations.labels.allConsiderations[language],
      allTypes: uiTranslations.labels.allTypes[language],
      results: uiTranslations.labels.results[language],
      result: uiTranslations.labels.result[language],

      // Model terminology
      guideline: terminology.guideline?.[language] || 'Guideline',
      guidelines: terminology.guidelines?.[language] || 'Guidelines',
      consideration: terminology.consideration?.[language] || 'Consideration',
      considerations: terminology.considerations?.[language] || 'Considerations',
      principle: terminology.principle?.[language] || 'Principle',
      principles: terminology.principles?.[language] || 'Principles',

      // Home page
      whatIsUDL: uiTranslations.home.whatIsUDL[language],
      udlDescription: uiTranslations.home.udlDescription[language],
      udlPrinciples: uiTranslations.home.udlPrinciples[language],
      engagementWhy: uiTranslations.home.engagementWhy[language],
      representationWhat: uiTranslations.home.representationWhat[language],
      actionExpressionHow: uiTranslations.home.actionExpressionHow[language],
      readyToTeach: uiTranslations.home.readyToTeach[language],

      // Messages
      noResults: uiTranslations.messages.noResults[language],
      itemNotFound: uiTranslations.messages.itemNotFound[language],

      // Visibility Toggle
      showConsiderations: uiTranslations.labels.showConsiderations[language],
      hideConsiderations: uiTranslations.labels.hideConsiderations[language],
      viewOptions: uiTranslations.labels.viewOptions[language],

      // Simple Actions
      viewAction: uiTranslations.labels.viewAction[language],
      searchAction: uiTranslations.labels.searchAction[language],
      showAction: uiTranslations.labels.showAction[language],
      hideAction: uiTranslations.labels.hideAction[language],
      modelAction: uiTranslations.labels.modelAction[language],

      // Examples
      examples: uiTranslations.labels.examples[language],
      allExamples: uiTranslations.labels.allExamples[language],
      educationalLevel: uiTranslations.labels.educationalLevel[language],
      curricularArea: uiTranslations.labels.curricularArea[language],
      webTools: uiTranslations.labels.webTools[language],
      allEducationalLevels: uiTranslations.labels.allEducationalLevels[language],
      allCurricularAreas: uiTranslations.labels.allCurricularAreas[language],
      udlAcronym: udlData.acronym[language],
      example: uiTranslations.labels.example[language],
      activity: uiTranslations.labels.activity[language],
      designOptions: uiTranslations.labels.designOptions[language],
    };
  }, [language, udlData]);

  return <UIContext.Provider value={ui}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
