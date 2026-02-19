import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { Background } from '../components/Background';
import { NodeCircle } from '../components/NodeCircle';
import { ConnectionLine } from '../components/ConnectionLine';
import { TextLabel } from '../components/TextLabel';
import { getNetworks, getTitle, getGoal, getAcronym, t, getNetworkQuestion } from '../utils/data';
import type { ConstellationProps } from '../types';

const WIDTH = 1920;
const HEIGHT = 1080;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;

// Radii for each ring
const RING_NETWORK = 200;
const RING_GUIDELINE = 400;
const RING_CONSIDERATION = 620;

// Timing (in frames at 30fps)
const INTRO_START = 0;
const CENTER_START = 60;
const NETWORK_START = 120;
const GUIDELINE_START = 250;
const CONSIDERATION_START = 450;
const ZOOM_START = 750;
const OUTRO_START = 850;

export const ConstellationMap: React.FC<ConstellationProps> = ({ lang }) => {
  const frame = useCurrentFrame();
  const networks = getNetworks();

  // Camera zoom effect
  const zoom = interpolate(frame, [ZOOM_START, ZOOM_START + 120], [1, 0.75], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const panY = interpolate(frame, [ZOOM_START, ZOOM_START + 120], [0, 30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Determine dominant glow color based on progress
  const glowColor =
    frame < NETWORK_START
      ? '#ffffff'
      : frame < GUIDELINE_START
        ? (networks[Math.min(Math.floor((frame - NETWORK_START) / 40), 2)]?.color ?? '#ffffff')
        : '#8866cc';

  // Compute node positions
  const networkPositions = networks.map((_, i) => {
    const angle = (i * (2 * Math.PI)) / 3 - Math.PI / 2;
    return { x: CX + Math.cos(angle) * RING_NETWORK, y: CY + Math.sin(angle) * RING_NETWORK };
  });

  // Compute guideline positions (distributed around their parent network)
  const guidelinePositions: { x: number; y: number; color: string; networkIdx: number }[] = [];
  let guidelineIndex = 0;
  networks.forEach((network, ni) => {
    const guidelines = network.principle.guidelines;
    const parentAngle = (ni * (2 * Math.PI)) / 3 - Math.PI / 2;
    const spreadAngle = (2 * Math.PI) / 3; // each network gets 120°

    guidelines.forEach((_, gi) => {
      const angle =
        parentAngle - spreadAngle / 2 + (spreadAngle / (guidelines.length + 1)) * (gi + 1);
      guidelinePositions.push({
        x: CX + Math.cos(angle) * RING_GUIDELINE,
        y: CY + Math.sin(angle) * RING_GUIDELINE,
        color: network.color,
        networkIdx: ni,
      });
      guidelineIndex++;
    });
  });

  // Compute consideration positions
  const considerationPositions: {
    x: number;
    y: number;
    color: string;
    guidelineGlobalIdx: number;
  }[] = [];
  let gIdx = 0;
  networks.forEach((network) => {
    network.principle.guidelines.forEach((guideline) => {
      const parentPos = guidelinePositions[gIdx];
      const parentAngle = Math.atan2(parentPos.y - CY, parentPos.x - CX);
      const spread = 0.35;

      guideline.considerations.forEach((_, ci) => {
        const angle =
          parentAngle -
          spread / 2 +
          (spread / Math.max(guideline.considerations.length - 1, 1)) * ci;
        considerationPositions.push({
          x: CX + Math.cos(angle) * RING_CONSIDERATION,
          y: CY + Math.sin(angle) * RING_CONSIDERATION,
          color: network.color,
          guidelineGlobalIdx: gIdx,
        });
      });
      gIdx++;
    });
  });

  return (
    <AbsoluteFill>
      <Background glowColor={glowColor} particleCount={80} />

      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `scale(${zoom}) translateY(${panY}px)`,
          transformOrigin: 'center center',
        }}
      >
        {/* Connection lines: center → networks */}
        {networkPositions.map((pos, i) => (
          <ConnectionLine
            key={`cn-${i}`}
            x1={CX}
            y1={CY}
            x2={pos.x}
            y2={pos.y}
            color={networks[i].color}
            delay={NETWORK_START + i * 25}
            duration={40}
            strokeWidth={2}
          />
        ))}

        {/* Connection lines: networks → guidelines */}
        {guidelinePositions.map((gp, i) => (
          <ConnectionLine
            key={`cg-${i}`}
            x1={networkPositions[gp.networkIdx].x}
            y1={networkPositions[gp.networkIdx].y}
            x2={gp.x}
            y2={gp.y}
            color={gp.color}
            delay={GUIDELINE_START + i * 15}
            duration={30}
          />
        ))}

        {/* Connection lines: guidelines → considerations */}
        {considerationPositions.map((cp, i) => {
          const gp = guidelinePositions[cp.guidelineGlobalIdx];
          return (
            <ConnectionLine
              key={`cc-${i}`}
              x1={gp.x}
              y1={gp.y}
              x2={cp.x}
              y2={cp.y}
              color={cp.color}
              delay={CONSIDERATION_START + i * 6}
              duration={20}
              strokeWidth={0.8}
            />
          );
        })}

        {/* Consideration nodes */}
        {(() => {
          let cIdx = 0;
          return networks.flatMap((network) =>
            network.principle.guidelines.flatMap((guideline) =>
              guideline.considerations.map((consideration) => {
                const pos = considerationPositions[cIdx];
                const node = (
                  <NodeCircle
                    key={`cons-${cIdx}`}
                    x={pos.x}
                    y={pos.y}
                    size={40}
                    color={pos.color}
                    label={consideration.code}
                    delay={CONSIDERATION_START + cIdx * 6 + 10}
                    fontSize={11}
                  />
                );
                cIdx++;
                return node;
              })
            )
          );
        })()}

        {/* Guideline nodes */}
        {guidelinePositions.map((gp, i) => {
          const guideline = (() => {
            let idx = 0;
            for (const n of networks) {
              for (const g of n.principle.guidelines) {
                if (idx === i) return g;
                idx++;
              }
            }
            return networks[0].principle.guidelines[0];
          })();

          return (
            <NodeCircle
              key={`gl-${i}`}
              x={gp.x}
              y={gp.y}
              size={70}
              color={gp.color}
              label={t(guideline.name, lang)}
              delay={GUIDELINE_START + i * 15 + 15}
              fontSize={10}
            />
          );
        })}

        {/* Network nodes */}
        {networkPositions.map((pos, i) => (
          <NodeCircle
            key={`net-${i}`}
            x={pos.x}
            y={pos.y}
            size={120}
            color={networks[i].color}
            label={t(networks[i].principle.name, lang)}
            subLabel={getNetworkQuestion(networks[i], lang)}
            delay={NETWORK_START + i * 25 + 20}
            fontSize={14}
          />
        ))}

        {/* Center UDL node */}
        <NodeCircle
          x={CX}
          y={CY}
          size={150}
          color="#ffffff"
          label={getAcronym(lang)}
          subLabel={getTitle(lang)}
          delay={CENTER_START}
          fontSize={28}
        />
      </div>

      {/* Title text (intro) */}
      <TextLabel
        text={getTitle(lang)}
        x={CX}
        y={80}
        fontSize={42}
        fontWeight={700}
        delay={INTRO_START}
        maxWidth={800}
      />

      {/* Goal text (outro) */}
      <TextLabel
        text={getGoal(lang)}
        x={CX}
        y={HEIGHT - 120}
        fontSize={20}
        fontWeight={300}
        delay={OUTRO_START}
        maxWidth={900}
        color="#cccccc"
      />

      {/* Author credit */}
      <TextLabel
        text="CAST © 2024"
        x={CX}
        y={HEIGHT - 60}
        fontSize={14}
        fontWeight={300}
        delay={OUTRO_START + 30}
        maxWidth={300}
        color="#666666"
      />
    </AbsoluteFill>
  );
};
