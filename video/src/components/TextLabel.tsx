import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { hexToRgba } from '../utils/colors';

interface TextLabelProps {
  text: string;
  x: number;
  y: number;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  delay?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
}

export const TextLabel: React.FC<TextLabelProps> = ({
  text,
  x,
  y,
  color = '#ffffff',
  fontSize = 18,
  fontWeight = 400,
  delay = 0,
  maxWidth = 400,
  align = 'center',
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(frame - delay, [0, 20], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'center' ? x - maxWidth / 2 : x,
        top: y,
        width: maxWidth,
        opacity,
        transform: `translateY(${translateY}px)`,
        textAlign: align,
      }}
    >
      <span
        style={{
          color,
          fontSize,
          fontFamily: 'Inter, sans-serif',
          fontWeight,
          lineHeight: 1.4,
          textShadow: `0 0 20px ${hexToRgba(color, 0.3)}`,
        }}
      >
        {text}
      </span>
    </div>
  );
};
