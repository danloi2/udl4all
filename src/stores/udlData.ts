import { writable, derived } from 'svelte/store';
import type {
  UDLRoot,
  UDLData,
  UDLIndex,
  Network,
  Principle,
  Guideline,
  Consideration,
} from '../types';
import udlJson from '../data/udl.json';

// Load and parse UDL data
const rawData = udlJson as UDLRoot;
export const udlData = writable<UDLData>(rawData.udl);

// Create indexed data for fast lookups
export const udlIndex = derived(udlData, ($udlData) => {
  const index: UDLIndex = {
    networks: new Map(),
    principles: new Map(),
    guidelines: new Map(),
    considerations: new Map(),
  };

  $udlData.networks.forEach((network: Network) => {
    index.networks.set(network.id, network);

    const principle = network.principle;
    index.principles.set(principle.id, principle);

    principle.guidelines.forEach((guideline: Guideline) => {
      index.guidelines.set(guideline.id, guideline);

      guideline.considerations.forEach((consideration: Consideration) => {
        index.considerations.set(consideration.id, consideration);
      });
    });
  });

  return index;
});

// Helper functions
export function getNetworkById(id: string, index: UDLIndex): Network | undefined {
  return index.networks.get(id);
}

export function getPrincipleById(id: string, index: UDLIndex): Principle | undefined {
  return index.principles.get(id);
}

export function getGuidelineById(id: string, index: UDLIndex): Guideline | undefined {
  return index.guidelines.get(id);
}

export function getConsiderationById(id: string, index: UDLIndex): Consideration | undefined {
  return index.considerations.get(id);
}

// Get network for a principle
export function getNetworkForPrinciple(principleId: string, data: UDLData): Network | undefined {
  return data.networks.find((n: Network) => n.principle.id === principleId);
}

// Get principle for a guideline
export function getPrincipleForGuideline(
  guidelineId: string,
  data: UDLData
): Principle | undefined {
  for (const network of data.networks) {
    if (network.principle.guidelines.some((g: Guideline) => g.id === guidelineId)) {
      return network.principle;
    }
  }
  return undefined;
}

// Get guideline for a consideration
export function getGuidelineForConsideration(
  considerationId: string,
  data: UDLData
): Guideline | undefined {
  for (const network of data.networks) {
    for (const guideline of network.principle.guidelines) {
      if (guideline.considerations.some((c: Consideration) => c.id === considerationId)) {
        return guideline;
      }
    }
  }
  return undefined;
}

// Get principle for a consideration
export function getPrincipleForConsideration(
  considerationId: string,
  data: UDLData
): Principle | undefined {
  const guideline = getGuidelineForConsideration(considerationId, data);
  if (guideline) {
    return getPrincipleForGuideline(guideline.id, data);
  }
  return undefined;
}

// Get network for a guideline
export function getNetworkForGuideline(guidelineId: string, data: UDLData): Network | undefined {
  return data.networks.find((n: Network) =>
    n.principle.guidelines.some((g: Guideline) => g.id === guidelineId)
  );
}

// Get network for a consideration
export function getNetworkForConsideration(
  considerationId: string,
  data: UDLData
): Network | undefined {
  const guideline = getGuidelineForConsideration(considerationId, data);
  if (guideline) {
    return getNetworkForGuideline(guideline.id, data);
  }
  return undefined;
}
