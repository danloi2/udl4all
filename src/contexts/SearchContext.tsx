import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import Fuse from 'fuse.js';
import {
  useUDLData,
  getConsiderationForExample,
  getGuidelineForConsideration,
  getPrincipleForGuideline,
} from './UDLDataContext';
import { useLanguage } from './LanguageContext';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPrinciple: string;
  setSelectedPrinciple: (id: string) => void;
  selectedGuideline: string;
  setSelectedGuideline: (id: string) => void;
  selectedConsideration: string;
  setSelectedConsideration: (id: string) => void;
  selectedEducationalLevel: string;
  setSelectedEducationalLevel: (level: string) => void;
  selectedCurricularArea: string;
  setSelectedCurricularArea: (area: string) => void;
  selectedType: 'all' | 'guideline' | 'consideration' | 'example' | 'activity';
  setSelectedType: (type: 'all' | 'guideline' | 'consideration' | 'example' | 'activity') => void;
  searchResults: any[];
  availableGuidelines: any[];
  availableConsiderations: any[];
  availableEducationalLevels: any[];
  availableCurricularAreas: any[];
  resetFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const { udlData, udlIndex } = useUDLData();
  const { language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrinciple, setSelectedPrinciple] = useState('all');
  const [selectedGuideline, setSelectedGuideline] = useState('all');
  const [selectedConsideration, setSelectedConsideration] = useState('all');
  const [selectedEducationalLevel, setSelectedEducationalLevel] = useState('all');
  const [selectedCurricularArea, setSelectedCurricularArea] = useState('all');
  const [selectedType, setSelectedType] = useState<
    'all' | 'guideline' | 'consideration' | 'example' | 'activity'
  >('all');

  // Build searchable items
  const searchableItems = useMemo(() => {
    const items: any[] = [];

    udlData.networks.forEach((network) => {
      const principle = network.principle;
      items.push({
        id: principle.id,
        code: '',
        type: 'principle',
        principleId: principle.id,
        item: principle,
      });

      principle.guidelines.forEach((guideline) => {
        items.push({
          id: guideline.id,
          code: guideline.code,
          type: 'guideline',
          principleId: principle.id,
          guidelineId: guideline.id,
          item: guideline,
          principleName: principle.name,
        });

        guideline.considerations.forEach((consideration) => {
          items.push({
            id: consideration.id,
            code: consideration.code,
            type: 'consideration',
            principleId: principle.id,
            guidelineId: guideline.id,
            item: consideration,
            principleName: principle.name,
            guidelineName: guideline.name,
          });
        });
      });
    });

    // Add Examples
    udlIndex.examples.forEach((example) => {
      const consideration = getConsiderationForExample(example.id, udlIndex);
      const considerationId = consideration ? consideration.id : '';
      let guidelineId = undefined;
      let principleId = undefined;

      if (considerationId) {
        const guideline = getGuidelineForConsideration(considerationId, udlData);
        if (guideline) {
          guidelineId = guideline.id;
          const principle = getPrincipleForGuideline(guideline.id, udlData);
          if (principle) principleId = principle.id;
        }
      }

      items.push({
        id: example.id,
        code: example.code,
        type: 'example',
        considerationId: considerationId,
        guidelineId: guidelineId,
        principleId: principleId,
        item: example,
        educationalLevel: example.educationalLevel,
        curricularArea: example.curricularArea,
      });
    });

    // Add Activities
    const uniqueActivities = new Set();
    udlIndex.activities.forEach((activity) => {
      if (!uniqueActivities.has(activity.id)) {
        uniqueActivities.add(activity.id);
        items.push({
          id: activity.code,
          code: activity.code,
          type: 'activity',
          item: activity,
          educationalLevel: activity.gradeLevel,
          curricularArea: activity.subject,
        });
      }
    });

    return items;
  }, [udlData, udlIndex]);

  // Fuse.js instance
  const fuse = useMemo(() => {
    return new Fuse(searchableItems, {
      keys: [
        { name: 'code', weight: 5 },
        { name: 'id', weight: 4 },
        { name: `item.name.${language}`, weight: 2 },
        { name: `item.description.${language}`, weight: 1.5 },
        { name: `item.activity.${language}`, weight: 2 },
        { name: `item.title.${language}`, weight: 3 },
        { name: `item.designOptions.${language}`, weight: 1.5 },
        { name: `item.educationalLevel.${language}`, weight: 1 },
        { name: `item.curricularArea.${language}`, weight: 1 },
        { name: 'item.webTools.name', weight: 1 },
        { name: `principleName.${language}`, weight: 0.8 },
        { name: `guidelineName.${language}`, weight: 0.8 },
      ],
      threshold: 0.4,
      location: 0,
      distance: 1000,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [searchableItems, language]);

  // Available guidelines
  const availableGuidelines = useMemo(() => {
    if (selectedPrinciple === 'all') {
      return udlData.networks.flatMap((n) => n.principle.guidelines);
    } else {
      const network = udlData.networks.find((n) => n.principle.id === selectedPrinciple);
      return network ? network.principle.guidelines : [];
    }
  }, [udlData, selectedPrinciple]);

  // Available considerations
  const availableConsiderations = useMemo(() => {
    let guidelines = [];
    if (selectedPrinciple === 'all') {
      guidelines = udlData.networks.flatMap((n) => n.principle.guidelines);
    } else {
      const network = udlData.networks.find((n) => n.principle.id === selectedPrinciple);
      guidelines = network ? network.principle.guidelines : [];
    }
    if (selectedGuideline !== 'all') {
      guidelines = guidelines.filter((g) => g.id === selectedGuideline);
    }
    return guidelines.flatMap((g) => g.considerations);
  }, [udlData, selectedPrinciple, selectedGuideline]);

  // Available educational levels
  const availableEducationalLevels = useMemo(() => {
    const levels = new Map();
    searchableItems
      .filter((item) => item.type === 'example' || item.type === 'activity')
      .forEach((item: any) => {
        const levelName = item.educationalLevel?.es || 'Unknown';
        levels.set(levelName, item.educationalLevel);
      });
    return Array.from(levels.values());
  }, [searchableItems]);

  // Available curricular areas
  const availableCurricularAreas = useMemo(() => {
    const areas = new Map();
    searchableItems
      .filter((item) => item.type === 'example' || item.type === 'activity')
      .forEach((item: any) => {
        const areaName = item.curricularArea?.es || 'Unknown';
        areas.set(areaName, item.curricularArea);
      });
    return Array.from(areas.values());
  }, [searchableItems]);

  // Search results
  const searchResults = useMemo(() => {
    let results = searchableItems;

    // Apply search query
    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery);
      results = fuseResults.map((result) => result.item);
    }

    // Apply filters
    if (selectedPrinciple !== 'all') {
      results = results.filter((item) => item.principleId === selectedPrinciple);
    }
    if (selectedGuideline !== 'all') {
      results = results.filter((item) => item.guidelineId === selectedGuideline);
    }
    if (selectedConsideration !== 'all') {
      results = results.filter(
        (item) =>
          item.id === selectedConsideration || item.considerationId === selectedConsideration
      );
    }
    if (selectedEducationalLevel !== 'all') {
      results = results.filter(
        (item) =>
          (item.type === 'example' || item.type === 'activity') &&
          item.educationalLevel?.es === selectedEducationalLevel
      );
    }
    if (selectedCurricularArea !== 'all') {
      results = results.filter(
        (item) =>
          (item.type === 'example' || item.type === 'activity') &&
          item.curricularArea?.es === selectedCurricularArea
      );
    }
    if (selectedType !== 'all') {
      results = results.filter((item) => item.type === selectedType);
    }

    // Sort results
    const typeOrder: Record<string, number> = {
      principle: 1,
      guideline: 2,
      consideration: 3,
      activity: 4,
      example: 5,
    };

    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery);
      results = fuseResults
        .sort((a, b) => {
          if (Math.abs(a.score! - b.score!) < 0.001) {
            return (
              (typeOrder[a.item.type as string] || 99) - (typeOrder[b.item.type as string] || 99)
            );
          }
          return a.score! - b.score!;
        })
        .map((result) => result.item);
    } else {
      results = [...results].sort((a, b) => {
        return (typeOrder[a.type as string] || 99) - (typeOrder[b.type as string] || 99);
      });
    }

    return results;
  }, [
    searchableItems,
    searchQuery,
    selectedPrinciple,
    selectedGuideline,
    selectedConsideration,
    selectedEducationalLevel,
    selectedCurricularArea,
    selectedType,
    fuse,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPrinciple('all');
    setSelectedGuideline('all');
    setSelectedConsideration('all');
    setSelectedEducationalLevel('all');
    setSelectedCurricularArea('all');
    setSelectedType('all');
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedPrinciple,
        setSelectedPrinciple,
        selectedGuideline,
        setSelectedGuideline,
        selectedConsideration,
        setSelectedConsideration,
        selectedEducationalLevel,
        setSelectedEducationalLevel,
        selectedCurricularArea,
        setSelectedCurricularArea,
        selectedType,
        setSelectedType,
        searchResults,
        availableGuidelines,
        availableConsiderations,
        availableEducationalLevels,
        availableCurricularAreas,
        resetFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
