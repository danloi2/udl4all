import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Background } from '../components/Background';
import { NodeCircle } from '../components/NodeCircle';
import { ConnectionLine } from '../components/ConnectionLine';
import { TextLabel } from '../components/TextLabel';
import { getGuidelineByCode, t } from '../utils/data';
import type { GuidelineClipProps } from '../types';

// Square format for social media (1080×1080)
const SIZE = 1080;
const CX = SIZE / 2;
const CY = SIZE / 2;

export const GuidelineClip: React.FC<GuidelineClipProps> = ({ guidelineCode, lang }) => {
  const result = getGuidelineByCode(guidelineCode);

  if (!result) {
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
        <span>Guideline "{guidelineCode}" not found</span>
      </AbsoluteFill>
    );
  }

  const { guideline, network } = result;
  const color = network.color;
  const considerations = guideline.considerations;

  // Layout: guideline node at center, considerations in a circle around it
  const radius = 300;

  return (
    <AbsoluteFill>
      <Background glowColor={color} particleCount={30} />

      {/* Network name at top */}
      <TextLabel
        text={t(network.principle.name, lang)}
        x={CX}
        y={50}
        fontSize={18}
        fontWeight={300}
        delay={0}
        maxWidth={500}
        color={color}
      />

      {/* Row label (Access / Support / Executive Function) */}
      <TextLabel
        text={t(guideline.row, lang)}
        x={CX}
        y={85}
        fontSize={14}
        fontWeight={300}
        delay={10}
        maxWidth={400}
        color="#888888"
      />

      {/* Guideline central node */}
      <NodeCircle
        x={CX}
        y={CY - 20}
        size={160}
        color={color}
        label={t(guideline.name, lang)}
        subLabel={`${t(guideline.preDescription, lang)}${t(guideline.name, lang)}`}
        delay={20}
        fontSize={14}
      />

      {/* Lines to considerations */}
      {considerations.map((_, ci) => {
        const angle = (ci * 2 * Math.PI) / considerations.length - Math.PI / 2;
        const tx = CX + Math.cos(angle) * radius;
        const ty = CY - 20 + Math.sin(angle) * radius;

        return (
          <ConnectionLine
            key={`line-${ci}`}
            x1={CX}
            y1={CY - 20}
            x2={tx}
            y2={ty}
            color={color}
            delay={60 + ci * 20}
            duration={25}
          />
        );
      })}

      {/* Consideration nodes */}
      {considerations.map((consideration, ci) => {
        const angle = (ci * 2 * Math.PI) / considerations.length - Math.PI / 2;
        const tx = CX + Math.cos(angle) * radius;
        const ty = CY - 20 + Math.sin(angle) * radius;

        return (
          <React.Fragment key={`cons-${ci}`}>
            <NodeCircle
              x={tx}
              y={ty}
              size={70}
              color={color}
              label={consideration.code}
              delay={60 + ci * 20 + 15}
              fontSize={14}
            />
            <TextLabel
              text={t(consideration.description, lang)}
              x={tx}
              y={ty + 45}
              fontSize={11}
              delay={60 + ci * 20 + 25}
              maxWidth={180}
              color="#cccccc"
            />
          </React.Fragment>
        );
      })}

      {/* Bottom credit */}
      <TextLabel
        text="UDL • CAST © 2024"
        x={CX}
        y={SIZE - 50}
        fontSize={12}
        fontWeight={300}
        delay={60 + considerations.length * 20 + 30}
        maxWidth={300}
        color="#555555"
      />
    </AbsoluteFill>
  );
};
