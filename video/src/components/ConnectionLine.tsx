import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { hexToRgba } from '../utils/colors';

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  delay?: number;
  duration?: number;
  strokeWidth?: number;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  delay = 0,
  duration = 30,
  strokeWidth = 1.5,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame - delay, [0, 10], [0, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (frame < delay) return null;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <linearGradient id={`line-grad-${x1}-${y1}-${x2}-${y2}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={hexToRgba(color, 0.8)} />
          <stop offset="100%" stopColor={hexToRgba(color, 0.3)} />
        </linearGradient>
      </defs>
      {/* Glow line */}
      <line
        x1={x1}
        y1={y1}
        x2={x1 + dx * progress}
        y2={y1 + dy * progress}
        stroke={hexToRgba(color, 0.15)}
        strokeWidth={strokeWidth * 4}
        opacity={opacity}
        strokeLinecap="round"
      />
      {/* Main line */}
      <line
        x1={x1}
        y1={y1}
        x2={x1 + dx * progress}
        y2={y1 + dy * progress}
        stroke={hexToRgba(color, 0.6)}
        strokeWidth={strokeWidth}
        opacity={opacity}
        strokeLinecap="round"
      />
      {/* Tip glow dot */}
      {progress > 0.05 && (
        <circle
          cx={x1 + dx * progress}
          cy={y1 + dy * progress}
          r={3}
          fill={color}
          opacity={opacity * 0.8}
        />
      )}
    </svg>
  );
};
