import { writable, derived } from 'svelte/store';
import type {
  UDLRoot,
  UDLData,
  UDLIndex,
  Network,
  Principle,
  Guideline,
  Consideration,
  Example,
  Activity,
  Adaptation,
  MultilingualText,
} from '../types';
import udlJson from '../data/json/udl-core.json';
import {
  NIVELES,
  AREAS_INFANTIL,
  AREAS_PRIMARIA,
  AREAS_ESO,
  BACHILLERATO_COMUNES,
  BACHILLERATO_MODALIDADES,
  AMBITOS_UNIVERSIDAD,
} from '../data/constants/constants';

// Load and parse UDL data
const rawData = udlJson as UDLRoot;
export const udlData = writable<UDLData>(rawData.udl);

// Import Activities dynamically
const activityModules = import.meta.glob('../data/json/activities/**/*.json', { eager: true });
const allActivityFiles = Object.values(activityModules).map((mod: any) => mod.default || mod);

// Helper to resolve Level and Area from explicit codes in JSON (e.g., "PRI", "MAT")
function resolveMetadata(levelCode: string, areaCode: string) {
  const level = Object.values(NIVELES).find((l) => l.id === levelCode);
  let area = null;

  if (levelCode === 'PRI') {
    area = Object.values(AREAS_PRIMARIA).find((a) => a.id === areaCode);
  } else if (levelCode === 'ESO') {
    area = Object.values(AREAS_ESO).find((a) => a.id === areaCode);
  } else if (levelCode === 'BAC') {
    area = Object.values(BACHILLERATO_COMUNES).find((a) => a.id === areaCode);
    if (!area) {
      for (const modal of Object.values(BACHILLERATO_MODALIDADES)) {
        const found = Object.values(modal).find((a: any) => a.id === areaCode);
        if (found) {
          area = found;
          break;
        }
      }
    }
  } else if (
    levelCode === 'INF' ||
    levelCode === 'CRE' ||
    levelCode === 'DES' ||
    levelCode === 'COM'
  ) {
    area = Object.values(AREAS_INFANTIL).find((a) => a.id === areaCode);
  }

  if (!area) {
    const allAreas = [
      ...Object.values(AREAS_INFANTIL),
      ...Object.values(AREAS_PRIMARIA),
      ...Object.values(AREAS_ESO),
      ...Object.values(BACHILLERATO_COMUNES),
      ...Object.values(AMBITOS_UNIVERSIDAD),
    ];
    area = allAreas.find((a) => a.id === areaCode);
  }

  return { level, area };
}

// Create indexed data for fast lookups
export const udlIndex = derived(udlData, ($udlData) => {
  const index: UDLIndex = {
    networks: new Map(),
    principles: new Map(),
    guidelines: new Map(),
    considerations: new Map(),
    examples: new Map(),
    activities: new Map(),
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

  // Process Activities
  allActivityFiles.forEach((activityData: any) => {
    const meta = resolveMetadata(activityData.gradeLevel, activityData.subject);

    const activity: Activity = {
      id: activityData.id,
      code: activityData.code,
      gradeLevel: meta.level
        ? meta.level.name
        : {
            es: activityData.gradeLevel,
            en: activityData.gradeLevel,
            eu: activityData.gradeLevel,
            la: activityData.gradeLevel,
          },
      subject: meta.area
        ? meta.area.name
        : {
            es: activityData.subject,
            en: activityData.subject,
            eu: activityData.subject,
            la: activityData.subject,
          },
      title: activityData.title,
      duaAdaptations: Object.fromEntries(
        Object.entries(activityData.duaAdaptations as Record<string, any>).map(([code, value]) => {
          if (typeof value === 'object' && 'text' in value) {
            return [code, value as Adaptation];
          }
          // Support legacy format for backward compatibility
          return [code, { text: value as MultilingualText, webTools: [] }];
        })
      ),
    };

    index.activities.set(activity.id, activity);
    if (activity.code !== activity.id) {
      index.activities.set(activity.code, activity);
    }

    Object.entries(activity.duaAdaptations).forEach(([code, adaptation]) => {
      let considerationId = null;
      let considerationColor = '#666';
      for (const [id, cons] of index.considerations) {
        if (cons.code === code) {
          considerationId = id;
          considerationColor = cons.color || '#666';
          break;
        }
      }

      if (considerationId) {
        const uniqueId = `${activityData.code}-${considerationId}`;
        const example: Example = {
          id: uniqueId,
          code: activityData.code,
          color: considerationColor,
          educationalLevel: meta.level
            ? meta.level.name
            : {
                es: activityData.gradeLevel,
                en: activityData.gradeLevel,
                eu: activityData.gradeLevel,
                la: activityData.gradeLevel,
              },
          curricularArea: meta.area
            ? meta.area.name
            : {
                es: activityData.subject,
                en: activityData.subject,
                eu: activityData.subject,
                la: activityData.subject,
              },
          activity: activityData.title,
          designOptions: adaptation.text,
          webTools: adaptation.webTools || [],
        };
        index.examples.set(example.id, example);
      }
    });
  });

  return index;
});

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

export function getNetworkForPrinciple(principleId: string, data: UDLData): Network | undefined {
  return data.networks.find((n: Network) => n.principle.id === principleId);
}

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

export function getExampleById(id: string, index: UDLIndex): Example | undefined {
  return index.examples.get(id);
}

export function getConsiderationForExample(
  exampleId: string,
  index: UDLIndex
): Consideration | undefined {
  const parts = exampleId.split('-');
  if (parts.length >= 2) {
    const suffix = `${parts[parts.length - 2]}-${parts[parts.length - 1]}`;
    if (index.considerations.has(suffix)) {
      return index.considerations.get(suffix);
    }
  }
  return undefined;
}

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

export function getNetworkForGuideline(guidelineId: string, data: UDLData): Network | undefined {
  return data.networks.find((n: Network) =>
    n.principle.guidelines.some((g: Guideline) => g.id === guidelineId)
  );
}

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

export function getActivityById(id: string, index: UDLIndex): Activity | undefined {
  return index.activities.get(id);
}
