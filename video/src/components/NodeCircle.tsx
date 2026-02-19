import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { glow, hexToRgba } from '../utils/colors';

interface NodeCircleProps {
  x: number;
  y: number;
  size: number;
  color: string;
  label: string;
  subLabel?: string;
  delay?: number;
  fontSize?: number;
}

export const NodeCircle: React.FC<NodeCircleProps> = ({
  x,
  y,
  size,
  color,
  label,
  subLabel,
  delay = 0,
  fontSize = 16,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle pulse
  const pulse = interpolate(Math.sin((frame - delay) * 0.03), [-1, 1], [0.95, 1.05]);

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2px solid ${hexToRgba(color, 0.8)}`,
        background: `radial-gradient(circle at 40% 35%, ${hexToRgba(color, 0.25)}, ${hexToRgba(color, 0.05)} 70%)`,
        boxShadow: glow(color, 0.6 * pulse),
        transform: `scale(${scale * pulse})`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
      }}
    >
      <span
        style={{
          color: '#ffffff',
          fontSize,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: 1.2,
          textShadow: `0 0 10px ${hexToRgba(color, 0.5)}`,
          maxWidth: size - 20,
          overflow: 'hidden',
        }}
      >
        {label}
      </span>
      {subLabel && (
        <span
          style={{
            color: hexToRgba('#ffffff', 0.6),
            fontSize: fontSize * 0.7,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            textAlign: 'center',
            marginTop: 4,
          }}
        >
          {subLabel}
        </span>
      )}
    </div>
  );
};
