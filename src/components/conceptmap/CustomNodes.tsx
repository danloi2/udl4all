import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import udlLogo from '../../assets/brains/udl_logo.svg';
import affectiveLogo from '../../assets/brains/affective_logo.svg';
import recognitionLogo from '../../assets/brains/recognition_logo.svg';
import strategicLogo from '../../assets/brains/strategic_logo.svg';

// ─── UDL Central Node ───────────────────────────────────────────────
interface UDLNodeData {
  label: string;
  subtitle: string;
  [key: string]: unknown;
}

export const UDLCentralNode = memo(({ data }: NodeProps) => {
  const d = data as UDLNodeData;
  return (
    <div className="udl-node udl-node--central">
      <img
        src={udlLogo}
        alt="UDL"
        className="udl-node__icon"
        style={{ width: '64px', height: '64px', objectFit: 'contain' }}
      />
      <div className="udl-node__label">{d.label}</div>
      <div className="udl-node__subtitle">{d.subtitle}</div>
      <Handle type="source" position={Position.Bottom} className="udl-handle udl-handle--central" />
    </div>
  );
});
UDLCentralNode.displayName = 'UDLCentralNode';

// ─── Network Node (3 redes neuronales) ──────────────────────────────
interface NetworkNodeData {
  label: string;
  why: string;
  color: string;
  networkId: string;
  [key: string]: unknown;
}

export const NetworkNode = memo(({ data }: NodeProps) => {
  const d = data as NetworkNodeData;
  return (
    <div
      className="udl-node udl-node--network"
      style={{
        borderColor: d.color,
        backgroundColor: `${d.color}10`,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="udl-handle"
        style={{ background: d.color }}
      />
      <div className="udl-node__badge" style={{ backgroundColor: 'transparent', padding: 0 }}>
        <img
          src={
            d.networkId === 'affective'
              ? affectiveLogo
              : d.networkId === 'recognition'
                ? recognitionLogo
                : strategicLogo
          }
          alt={d.label}
          style={{ width: '48px', height: '48px', objectFit: 'contain' }}
        />
      </div>
      <div className="udl-node__label" style={{ color: d.color }}>
        {d.label}
      </div>
      <div className="udl-node__why">{d.why}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="udl-handle"
        style={{ background: d.color }}
      />
    </div>
  );
});
NetworkNode.displayName = 'NetworkNode';

// ─── Principle Node ─────────────────────────────────────────────────
interface PrincipleNodeData {
  label: string;
  preDescription: string;
  color: string;
  [key: string]: unknown;
}

export const PrincipleNode = memo(({ data }: NodeProps) => {
  const d = data as PrincipleNodeData;
  return (
    <div
      className="udl-node udl-node--principle"
      style={{
        borderColor: d.color,
        backgroundColor: `${d.color}15`,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="udl-handle"
        style={{ background: d.color }}
      />
      <div className="udl-node__pre" style={{ color: `${d.color}CC` }}>
        {d.preDescription}
      </div>
      <div className="udl-node__label" style={{ color: d.color }}>
        {d.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="udl-handle"
        style={{ background: d.color }}
      />
    </div>
  );
});
PrincipleNode.displayName = 'PrincipleNode';

// ─── Guideline Node ─────────────────────────────────────────────────
interface GuidelineNodeData {
  label: string;
  code: string;
  row: string;
  color: string;
  [key: string]: unknown;
}

export const GuidelineNode = memo(({ data }: NodeProps) => {
  const d = data as GuidelineNodeData;
  return (
    <div
      className="udl-node udl-node--guideline"
      style={{
        borderColor: `${d.color}80`,
        backgroundColor: `${d.color}0D`,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="udl-handle"
        style={{ background: d.color }}
      />
      <div className="udl-node__row-badge" style={{ backgroundColor: d.color }}>
        {d.row}
      </div>
      <div className="udl-node__code" style={{ color: d.color }}>
        P{d.code}
      </div>
      <div className="udl-node__label">{d.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="udl-handle"
        style={{ background: d.color }}
      />
    </div>
  );
});
GuidelineNode.displayName = 'GuidelineNode';

// ─── Consideration Node ─────────────────────────────────────────────
interface ConsiderationNodeData {
  label: string;
  code: string;
  color: string;
  [key: string]: unknown;
}

export const ConsiderationNode = memo(({ data }: NodeProps) => {
  const d = data as ConsiderationNodeData;
  return (
    <div
      className="udl-node udl-node--consideration"
      style={{
        borderColor: `${d.color}60`,
        backgroundColor: `${d.color}08`,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="udl-handle udl-handle--small"
        style={{ background: d.color }}
      />
      <div className="udl-node__code-small" style={{ color: d.color }}>
        {d.code}
      </div>
      <div className="udl-node__label-small">{d.label}</div>
    </div>
  );
});
ConsiderationNode.displayName = 'ConsiderationNode';
