import type { Node, Edge } from '@xyflow/react';
import type { UDLData, Language, MultilingualText } from '../../types';

function t(obj: MultilingualText | undefined, lang: Language): string {
  if (!obj) return '';
  const val = obj[lang] ?? obj['en'] ?? '';
  return Array.isArray(val) ? val.join(' ') : val;
}

/**
 * Genera los nodos y aristas del mapa conceptual UDL.
 *
 * Layout: Las 3 redes se distribuyen horizontalmente.
 * Cada red tiene 3 pautas debajo, y las consideraciones se apilan
 * en columnas de 2 debajo de cada pauta para mantener el grafo compacto.
 */
export function buildUDLGraph(udlData: UDLData, lang: Language): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // ─── Layout constants ─────────────────────────────────────────
  // Cada pauta necesita espacio para 4 consideraciones en 2 columnas = 2 filas
  const CONS_COLS = 2;
  const CONS_COL_WIDTH = 180;
  const CONS_ROW_HEIGHT = 100;

  const GUIDELINE_WIDTH = CONS_COLS * CONS_COL_WIDTH; // 360px - ancho para 2 columnas de consideraciones
  const GUIDELINE_GAP = 40; // gap entre pautas
  const NETWORK_GAP = 100; // gap entre redes

  const Y = {
    center: 0,
    network: 180,
    principle: 340,
    guideline: 500,
    consideration: 680,
  };

  // ─── Calcular ancho de cada red ───────────────────────────────
  const networkWidths = udlData.networks.map((network) => {
    const numGuidelines = network.principle.guidelines.length;
    return numGuidelines * GUIDELINE_WIDTH + (numGuidelines - 1) * GUIDELINE_GAP;
  });

  const totalWidth =
    networkWidths.reduce((a, b) => a + b, 0) + (networkWidths.length - 1) * NETWORK_GAP;

  // Posiciones X de inicio de cada red
  let startX = -totalWidth / 2;
  const networkStarts: number[] = [];
  networkWidths.forEach((w) => {
    networkStarts.push(startX);
    startX += w + NETWORK_GAP;
  });

  // ─── Nodo central UDL ─────────────────────────────────────────
  nodes.push({
    id: 'udl-center',
    type: 'udlCentral',
    position: { x: -80, y: Y.center },
    data: {
      label: t(udlData.acronym, lang),
      subtitle: t(udlData.title, lang),
    },
  });

  // ─── Iterar redes ─────────────────────────────────────────────
  udlData.networks.forEach((network, netIdx) => {
    const color = network.color || '#666';
    const netStart = networkStarts[netIdx];
    const netWidth = networkWidths[netIdx];
    const netCenter = netStart + netWidth / 2;
    const why = network.why || network.what || network.how;

    // Red
    const networkNodeId = `network-${network.id}`;
    nodes.push({
      id: networkNodeId,
      type: 'networkNode',
      position: { x: netCenter - 110, y: Y.network },
      data: {
        label: t(network.name, lang),
        why: why ? t(why, lang) : '',
        color,
        networkId: network.id,
      },
    });
    edges.push({
      id: `e-udl-${network.id}`,
      source: 'udl-center',
      target: networkNodeId,
      type: 'smoothstep',
      style: { stroke: color, strokeWidth: 3 },
      animated: true,
    });

    // Principio
    const principle = network.principle;
    const principleNodeId = `principle-${principle.id}`;
    nodes.push({
      id: principleNodeId,
      type: 'principleNode',
      position: { x: netCenter - 100, y: Y.principle },
      data: {
        label: t(principle.name, lang),
        preDescription: t(principle.preDescription, lang),
        color,
      },
    });
    edges.push({
      id: `e-${network.id}-${principle.id}`,
      source: networkNodeId,
      target: principleNodeId,
      type: 'smoothstep',
      style: { stroke: color, strokeWidth: 2 },
    });

    // Pautas
    const guidelines = principle.guidelines;
    guidelines.forEach((guideline, gIdx) => {
      const gx = netStart + gIdx * (GUIDELINE_WIDTH + GUIDELINE_GAP) + GUIDELINE_WIDTH / 2;
      const guidelineNodeId = `guideline-${guideline.id}`;

      nodes.push({
        id: guidelineNodeId,
        type: 'guidelineNode',
        position: { x: gx - 90, y: Y.guideline },
        data: {
          label: t(guideline.name, lang),
          code: guideline.code,
          row: t(guideline.row, lang),
          color,
        },
      });
      edges.push({
        id: `e-${principle.id}-${guideline.id}`,
        source: principleNodeId,
        target: guidelineNodeId,
        type: 'smoothstep',
        style: { stroke: `${color}99`, strokeWidth: 1.5 },
      });

      // Consideraciones en grid de 2 columnas centradas bajo la pauta
      const considerations = guideline.considerations;
      // Usar siempre el ancho completo de 2 columnas para consistencia
      const gridStartX = gx - (CONS_COLS * CONS_COL_WIDTH) / 2;

      considerations.forEach((consideration: any, cIdx: number) => {
        const col = cIdx % CONS_COLS;
        const row = Math.floor(cIdx / CONS_COLS);
        const cx = gridStartX + col * CONS_COL_WIDTH;
        const cy = Y.consideration + row * CONS_ROW_HEIGHT;
        const consNodeId = `consideration-${consideration.id}`;

        nodes.push({
          id: consNodeId,
          type: 'considerationNode',
          position: { x: cx, y: cy },
          data: {
            label: t(consideration.description, lang),
            code: consideration.code,
            color,
          },
        });
        edges.push({
          id: `e-${guideline.id}-${consideration.id}`,
          source: guidelineNodeId,
          target: consNodeId,
          type: 'smoothstep',
          style: { stroke: `${color}66`, strokeWidth: 1 },
        });
      });
    });
  });

  return { nodes, edges };
}
