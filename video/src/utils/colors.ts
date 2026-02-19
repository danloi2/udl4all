/**
 * Color utilities — glow, gradients, particles
 */

/** Create a CSS glow box-shadow from a hex color */
export const glow = (color: string, intensity: number = 1): string => {
  const size = Math.round(20 * intensity);
  const spread = Math.round(10 * intensity);
  return `0 0 ${size}px ${spread}px ${color}80, 0 0 ${size * 2}px ${spread * 2}px ${color}40`;
};

/** Create a radial gradient background from center color */
export const radialGradient = (color: string, opacity: number = 0.15): string => {
  return `radial-gradient(circle at 50% 50%, ${color}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')}, transparent 70%)`;
};

/** Hex to rgba */
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Lighten a hex color */
export const lighten = (hex: string, amount: number): string => {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + Math.round(255 * amount));
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + Math.round(255 * amount));
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/** Network colors from the JSON */
export const NETWORK_COLORS = {
  affective: '#078743',
  recognition: '#6F5094',
  strategic: '#037DB8',
} as const;
