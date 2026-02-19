import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, random } from 'remotion';
import { hexToRgba } from '../utils/colors';

interface ParticleData {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  phase: number;
}

interface BackgroundProps {
  glowColor?: string;
  particleCount?: number;
}

export const Background: React.FC<BackgroundProps> = ({
  glowColor = '#ffffff',
  particleCount = 60,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo<ParticleData[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      x: random(`particle-x-${i}`) * 100,
      y: random(`particle-y-${i}`) * 100,
      size: random(`particle-s-${i}`) * 3 + 0.5,
      speed: random(`particle-sp-${i}`) * 0.3 + 0.05,
      opacity: random(`particle-o-${i}`) * 0.5 + 0.1,
      phase: random(`particle-p-${i}`) * Math.PI * 2,
    }));
  }, [particleCount]);

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #0d0d2b 0%, #050510 60%, #000000 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hexToRgba(glowColor, 0.06)} 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Particles */}
      {particles.map((p, i) => {
        const drift = Math.sin(frame * p.speed * 0.05 + p.phase) * 15;
        const driftY = Math.cos(frame * p.speed * 0.03 + p.phase * 1.3) * 10;
        const pulse = interpolate(Math.sin(frame * 0.02 + p.phase), [-1, 1], [0.4, 1]);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `calc(${p.x}% + ${drift}px)`,
              top: `calc(${p.y}% + ${driftY}px)`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: hexToRgba(glowColor, p.opacity * pulse),
              boxShadow: `0 0 ${p.size * 3}px ${hexToRgba(glowColor, p.opacity * pulse * 0.5)}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
