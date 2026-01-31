import { writable, derived, get } from 'svelte/store';
import Fuse from 'fuse.js';
import { udlData } from './udlData';
import { language } from './language';
import type { SearchResult, Language } from '../types';

// Search state
export const searchQuery = writable<string>('');
export const selectedPrinciple = writable<string>('all');
export const selectedGuideline = writable<string>('all');
export const selectedConsideration = writable<string>('all');
export const selectedType = writable<'all' | 'guideline' | 'consideration'>('all');

// Build searchable items
export const searchableItems = derived([udlData, language], ([$udlData, $language]) => {
  const items: SearchResult[] = [];

  $udlData.networks.forEach((network) => {
    const principle = network.principle;
    // Add principle
    items.push({
      id: principle.id,
      code: '',
      type: 'principle',
      principleId: principle.id,
      item: principle,
    });

    principle.guidelines.forEach((guideline) => {
      // Add guideline
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
        // Add consideration
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

  return items;
});

// Fuse.js instance for fuzzy search
export const fuse = derived([searchableItems, language], ([$searchableItems, $language]) => {
  return new Fuse($searchableItems, {
    keys: [
      { name: 'code', weight: 3 },
      { name: `item.name.${$language}`, weight: 2 },
      { name: `item.description.${$language}`, weight: 1.5 },
      { name: `principleName.${$language}`, weight: 0.8 },
      { name: `guidelineName.${$language}`, weight: 0.8 },
    ],
    threshold: 0.4, // back to 0.4 but with ignoreLocation
    location: 0,
    distance: 1000,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
});

// Available guidelines based on selected principle
export const availableGuidelines = derived(
  [udlData, selectedPrinciple],
  ([$udlData, $selectedPrinciple]) => {
    if ($selectedPrinciple === 'all') {
      // Return all guidelines from all networks
      return $udlData.networks.flatMap((n) => n.principle.guidelines);
    } else {
      // Return guidelines only from the selected principle
      const network = $udlData.networks.find((n) => n.principle.id === $selectedPrinciple);
      return network ? network.principle.guidelines : [];
    }
  }
);

// Available considerations based on selected principle and guideline
export const availableConsiderations = derived(
  [udlData, selectedPrinciple, selectedGuideline],
  ([$udlData, $selectedPrinciple, $selectedGuideline]) => {
    let guidelines = [];

    if ($selectedPrinciple === 'all') {
      // Get all guidelines from all networks
      guidelines = $udlData.networks.flatMap((n) => n.principle.guidelines);
    } else {
      // Get guidelines from selected principle
      const network = $udlData.networks.find((n) => n.principle.id === $selectedPrinciple);
      guidelines = network ? network.principle.guidelines : [];
    }

    if ($selectedGuideline !== 'all') {
      // Filter to only the selected guideline
      guidelines = guidelines.filter((g) => g.id === $selectedGuideline);
    }

    // Return all considerations from the filtered guidelines
    return guidelines.flatMap((g) => g.considerations);
  }
);

// Filtered and searched results
export const searchResults = derived(
  [
    searchableItems,
    searchQuery,
    selectedPrinciple,
    selectedGuideline,
    selectedConsideration,
    selectedType,
    fuse,
  ],
  ([
    $searchableItems,
    $searchQuery,
    $selectedPrinciple,
    $selectedGuideline,
    $selectedConsideration,
    $selectedType,
    $fuse,
  ]) => {
    let results = $searchableItems;

    // Apply search query
    if ($searchQuery.trim()) {
      const fuseResults = $fuse.search($searchQuery);
      results = fuseResults.map((result) => result.item);
    }

    // Apply principle filter
    if ($selectedPrinciple !== 'all') {
      results = results.filter((item) => item.principleId === $selectedPrinciple);
    }

    // Apply guideline filter
    if ($selectedGuideline !== 'all') {
      results = results.filter((item) => item.guidelineId === $selectedGuideline);
    }

    // Apply consideration filter
    if ($selectedConsideration !== 'all') {
      results = results.filter((item) => item.id === $selectedConsideration);
    }

    // Apply type filter
    if ($selectedType !== 'all') {
      results = results.filter((item) => item.type === $selectedType);
    }

    return results;
  }
);

// Reset filters
export function resetFilters() {
  searchQuery.set('');
  selectedPrinciple.set('all');
  selectedGuideline.set('all');
  selectedConsideration.set('all');
  selectedType.set('all');
}
