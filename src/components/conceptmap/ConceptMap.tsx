import { toPng, toSvg } from 'html-to-image';
import {
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useUDLData } from '../../contexts/UDLDataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { buildUDLGraph } from './buildGraph';
import {
  UDLCentralNode,
  NetworkNode,
  PrincipleNode,
  GuidelineNode,
  ConsiderationNode,
} from './CustomNodes';

const nodeTypes = {
  udlCentral: UDLCentralNode,
  networkNode: NetworkNode,
  principleNode: PrincipleNode,
  guidelineNode: GuidelineNode,
  considerationNode: ConsiderationNode,
};

function getMinimapNodeColor(node: any): string {
  if (node.type === 'udlCentral') return '#1F2937';
  if (node.data?.color) return node.data.color as string;
  return '#94a3b8';
}

type VisibilityLevel = 'all' | 'guidelines' | 'principles' | 'networks';

export interface ConceptMapRef {
  prepareForPrint: () => void;
  restoreAfterPrint: () => void;
  captureMap: (format?: 'png' | 'svg') => Promise<string | null>;
}

interface ConceptMapProps {
  isPrintMode?: boolean;
}

const ConceptMap = forwardRef<ConceptMapRef, ConceptMapProps>(({ isPrintMode = false }, ref) => {
  const { udlData } = useUDLData();
  const { language, t } = useLanguage();
  const [visibilityLevel, setVisibilityLevel] = useState<VisibilityLevel>(
    isPrintMode ? 'all' : 'guidelines'
  );
  const [isInternalPrinting, setIsInternalPrinting] = useState(false);
  const rfInstance = useRef<ReactFlowInstance | null>(null);

  const { nodes: allNodes, edges: allEdges } = useMemo(
    () => buildUDLGraph(udlData, language),
    [udlData, language]
  );

  // Filtrar nodos según nivel de visibilidad
  const filteredData = useMemo(() => {
    const hiddenTypes: Record<VisibilityLevel, string[]> = {
      all: [],
      guidelines: ['considerationNode'],
      principles: ['considerationNode', 'guidelineNode'],
      networks: ['considerationNode', 'guidelineNode', 'principleNode'],
    };

    const hidden = new Set(hiddenTypes[visibilityLevel]);
    const visibleNodes = allNodes.filter((n) => !hidden.has(n.type || ''));
    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
    const visibleEdges = allEdges.filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );

    return { nodes: visibleNodes, edges: visibleEdges };
  }, [allNodes, allEdges, visibilityLevel]);

  const [nodes, setNodes, onNodesChange] = useNodesState(filteredData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(filteredData.edges);

  // Actualizar nodos/aristas y hacer fitView cuando cambia el filtro
  useEffect(() => {
    setNodes(filteredData.nodes);
    setEdges(filteredData.edges);
    // Pequeño delay para que React Flow procese los nuevos nodos antes de fitView
    setTimeout(() => {
      rfInstance.current?.fitView({ padding: 0.15, duration: 400 });
    }, 50);
  }, [filteredData]);

  // Force fitView when entering print mode
  useEffect(() => {
    if (isPrintMode && rfInstance.current) {
      setTimeout(() => {
        rfInstance.current?.fitView({ padding: 0.05, duration: 0, includeHiddenNodes: false });
      }, 500); // Wait for container layout
    }
  }, [isPrintMode]);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    rfInstance.current = instance;
    instance.fitView({ padding: 0.15, duration: 600 });
  }, []);

  const handleLevelChange = useCallback((level: VisibilityLevel) => {
    setVisibilityLevel(level);
  }, []);

  const levelLabels: Record<VisibilityLevel, string> = {
    all: '🔍 Todo',
    guidelines: '📋 Hasta Pautas',
    principles: '📐 Hasta Principios',
    networks: '🧠 Solo Redes',
  };

  // Estado para controlar si estamos en modo impresión
  const containerRef = useRef<HTMLDivElement>(null);

  // Exponer métodos para impresión
  useImperativeHandle(ref, () => ({
    captureMap: async (format: 'png' | 'svg' = 'png') => {
      if (rfInstance.current && containerRef.current) {
        // Step 1: Hide UI elements for capture
        setIsInternalPrinting(true);
        // Wait for React to render the change
        await new Promise((resolve) => setTimeout(resolve, 100));

        const options = {
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          style: {
            transform: 'scale(1)',
          },
        };

        try {
          let result: string | null = null;
          if (format === 'svg') {
            result = await toSvg(containerRef.current, options);
          } else {
            result = await toPng(containerRef.current, options);
          }
          return result;
        } catch (error) {
          console.error('Error during capture:', error);
          return null;
        } finally {
          // Step 3: Restore UI elements
          setIsInternalPrinting(false);
        }
      }
      return null;
    },
    prepareForPrint: () => {},
    restoreAfterPrint: () => {},
  }));

  return (
    <div ref={containerRef} className="concept-map-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.05}
        maxZoom={2.5}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />

        {/* Hide controls and minimap during capture */}
        {!isInternalPrinting && (
          <>
            <Controls showInteractive={false} position="top-right" />
            <MiniMap
              nodeColor={getMinimapNodeColor}
              maskColor="rgba(0,0,0,0.08)"
              className="concept-map-minimap"
              position="bottom-left"
            />

            {/* Panel de control de profundidad - Hidden during capture */}
            <Panel position="top-left" className="concept-map-panel">
              <div className="concept-map-panel__title">Profundidad</div>
              <div className="concept-map-panel__buttons">
                {(Object.keys(levelLabels) as VisibilityLevel[]).map((level) => (
                  <button
                    key={level}
                    className={`concept-map-panel__btn ${visibilityLevel === level ? 'concept-map-panel__btn--active' : ''}`}
                    onClick={() => handleLevelChange(level)}
                  >
                    {levelLabels[level]}
                  </button>
                ))}
              </div>
            </Panel>
          </>
        )}

        {/* Leyenda - Moves to top-left during capture */}
        <Panel
          position={isInternalPrinting ? 'top-left' : 'top-center'}
          className="concept-map-legend"
        >
          <div className="concept-map-legend__title">Redes Neuronales</div>
          {udlData.networks.map((network) => (
            <div key={network.id} className="concept-map-legend__item">
              <span
                className="concept-map-legend__dot"
                style={{ backgroundColor: network.color || '#666' }}
              />
              <span className="concept-map-legend__label">
                {t(network.name)} — {t(network.why || network.what || network.how)}
              </span>
            </div>
          ))}
        </Panel>
      </ReactFlow>
    </div>
  );
});

export default ConceptMap;
