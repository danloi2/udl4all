import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { Background } from '../components/Background';
import { NodeCircle } from '../components/NodeCircle';
import { ConnectionLine } from '../components/ConnectionLine';
import { TextLabel } from '../components/TextLabel';
import { getNetwork, t, getNetworkQuestion } from '../utils/data';
import type { NetworkExplorerProps } from '../types';

const WIDTH = 1920;
const HEIGHT = 1080;
const CX = WIDTH / 2;
const CY = HEIGHT / 2 + 30;

// Timing
const TITLE_START = 0;
const PRINCIPLE_START = 45;
const GUIDELINE_BASE = 100;
const GUIDELINE_SPACING = 80;

export const NetworkExplorer: React.FC<NetworkExplorerProps> = ({ networkId, lang }) => {
  const frame = useCurrentFrame();
  const network = getNetwork(networkId);

  if (!network) {
    return (
      <AbsoluteFill
        style={{
          background: '#000',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span>Network "{networkId}" not found</span>
      </AbsoluteFill>
    );
  }

  const color = network.color;
  const guidelines = network.principle.guidelines;

  // Layout: principle node at top center, guidelines spread horizontally below
  const principlePos = { x: CX, y: CY - 180 };
  const guidelineYBase = CY + 50;
  const guidelineSpread = 500;

  const guidelinePositions = guidelines.map((_, i) => {
    const totalWidth = (guidelines.length - 1) * guidelineSpread;
    const startX = CX - totalWidth / 2;
    return { x: startX + i * guidelineSpread, y: guidelineYBase };
  });

  return (
    <AbsoluteFill>
      <Background glowColor={color} particleCount={50} />

      {/* Title: network name */}
      <TextLabel
        text={t(network.name, lang)}
        x={CX}
        y={60}
        fontSize={36}
        fontWeight={700}
        color={color}
        delay={TITLE_START}
        maxWidth={800}
      />

      {/* Subtitle: why/what/how */}
      <TextLabel
        text={getNetworkQuestion(network, lang)}
        x={CX}
        y={115}
        fontSize={22}
        fontWeight={300}
        delay={TITLE_START + 15}
        maxWidth={600}
        color="#aaaaaa"
      />

      {/* Principle node */}
      <NodeCircle
        x={principlePos.x}
        y={principlePos.y}
        size={160}
        color={color}
        label={t(network.principle.name, lang)}
        delay={PRINCIPLE_START}
        fontSize={18}
      />

      {/* Lines: principle → guidelines */}
      {guidelinePositions.map((gp, i) => (
        <ConnectionLine
          key={`pg-${i}`}
          x1={principlePos.x}
          y1={principlePos.y + 80}
          x2={gp.x}
          y2={gp.y - 55}
          color={color}
          delay={GUIDELINE_BASE + i * 20}
          duration={30}
          strokeWidth={2}
        />
      ))}

      {/* Guideline nodes + their considerations */}
      {guidelines.map((guideline, gi) => {
        const gp = guidelinePositions[gi];
        const guidelineDelay = GUIDELINE_BASE + gi * GUIDELINE_SPACING;
        const considerations = guideline.considerations;

        // Consideration positions: arc below the guideline
        const arcRadius = 160;
        const arcSpread = Math.PI * 0.6;
        const arcStart = Math.PI / 2 - arcSpread / 2;

        return (
          <React.Fragment key={`g-${gi}`}>
            {/* Guideline node */}
            <NodeCircle
              x={gp.x}
              y={gp.y}
              size={110}
              color={color}
              label={t(guideline.name, lang)}
              subLabel={t(guideline.row, lang)}
              delay={guidelineDelay + 15}
              fontSize={12}
            />

            {/* Consideration lines & nodes */}
            {considerations.map((consideration, ci) => {
              const angle = arcStart + (arcSpread / Math.max(considerations.length - 1, 1)) * ci;
              const cx = gp.x + Math.cos(angle) * arcRadius;
              const cy = gp.y + Math.sin(angle) * arcRadius;
              const consDelay = guidelineDelay + 40 + ci * 12;

              return (
                <React.Fragment key={`c-${gi}-${ci}`}>
                  <ConnectionLine
                    x1={gp.x}
                    y1={gp.y + 55}
                    x2={cx}
                    y2={cy - 20}
                    color={color}
                    delay={consDelay}
                    duration={20}
                    strokeWidth={1}
                  />
                  <NodeCircle
                    x={cx}
                    y={cy}
                    size={50}
                    color={color}
                    label={consideration.code}
                    delay={consDelay + 10}
                    fontSize={12}
                  />
                  {/* Consideration text on hover/appear */}
                  <TextLabel
                    text={t(consideration.description, lang)}
                    x={cx}
                    y={cy + 30}
                    fontSize={9}
                    delay={consDelay + 15}
                    maxWidth={140}
                    color="#999999"
                  />
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}

      {/* Description at bottom */}
      <TextLabel
        text={t(network.description, lang)}
        x={CX}
        y={HEIGHT - 80}
        fontSize={16}
        fontWeight={300}
        delay={GUIDELINE_BASE + guidelines.length * GUIDELINE_SPACING}
        maxWidth={1000}
        color="#888888"
      />
    </AbsoluteFill>
  );
};
