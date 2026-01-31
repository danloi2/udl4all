// Color mapping for UDL principles - now using colors from JSON data with inline styles

import type { Principle, Guideline } from '../types';

export type PrincipleId = 'engagement' | 'representation' | 'action_expression';

// Helper to convert hex to RGB for inline styles
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Generate inline style strings from hex colors
export function getColorStyles(hexColor: string) {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return getDefaultColorStyles();

  return {
    bg: `background-color: ${hexColor}`,
    bgLight: `background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
    bgMedium: `background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
    text: `color: ${hexColor}`,
    textDark: `color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`,
    border: `border-color: ${hexColor}`,
    borderLight: `border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`,
    hex: hexColor,
  };
}

// Fallback styles if JSON doesn't have color data
function getDefaultColorStyles() {
  return {
    bg: 'background-color: #6B7280',
    bgLight: 'background-color: rgba(107, 114, 128, 0.1)',
    bgMedium: 'background-color: rgba(107, 114, 128, 0.2)',
    text: 'color: #374151',
    textDark: 'color: #1F2937',
    border: 'border-color: #6B7280',
    borderLight: 'border-color: rgba(107, 114, 128, 0.3)',
    hex: '#6B7280',
  };
}

// Get styles for a principle
export function getPrincipleStyles(principle: Principle | string) {
  if (typeof principle === 'string') {
    return getDefaultColorStyles();
  }

  if (principle.color) {
    return getColorStyles(principle.color);
  }

  return getDefaultColorStyles();
}

// Get styles for a guideline
export function getGuidelineStyles(guideline: Guideline) {
  if (guideline.color) {
    return getColorStyles(guideline.color);
  }

  return getDefaultColorStyles();
}

// Legacy function for backward compatibility
export function getPrincipleIdByGuidelineCode(code: string): PrincipleId {
  const guidelineCodeToPrinciple: Record<string, PrincipleId> = {
    '7': 'engagement',
    '8': 'engagement',
    '9': 'engagement',
    '1': 'representation',
    '2': 'representation',
    '3': 'representation',
    '4': 'action_expression',
    '5': 'action_expression',
    '6': 'action_expression',
  };

  return guidelineCodeToPrinciple[code] || 'engagement';
}

// DEPRECATED - keeping for compatibility but use inline styles instead
export function getColorClasses(hexColor: string) {
  return {
    bg: `bg-[${hexColor}]`,
    bgLight: `bg-[${hexColor}]/10`,
    bgMedium: `bg-[${hexColor}]/20`,
    text: `text-[${hexColor}]`,
    textDark: `text-[${hexColor}]/80`,
    border: `border-[${hexColor}]`,
    borderLight: `border-[${hexColor}]/30`,
    hover: `hover:bg-[${hexColor}]/5`,
    ring: `ring-[${hexColor}]`,
    hex: hexColor,
  };
}

export function getPrincipleColors(principle: Principle | string) {
  if (typeof principle === 'string') {
    return getColorClasses('#6B7280');
  }

  if (principle.color) {
    return getColorClasses(principle.color);
  }

  return getColorClasses('#6B7280');
}

export function getGuidelineColors(guideline: Guideline) {
  if (guideline.color) {
    return getColorClasses(guideline.color);
  }

  return getColorClasses('#6B7280');
}
