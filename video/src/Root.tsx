import React from 'react';
import { Composition } from 'remotion';
import { ConstellationMap } from './compositions/ConstellationMap';
import { NetworkExplorer } from './compositions/NetworkExplorer';
import { GuidelineClip } from './compositions/GuidelineClip';
import { getNetworks, getAllGuidelines, LANGUAGES } from './utils/data';
import type { Lang } from './types';

// Load Inter font
import '@remotion/google-fonts/Inter';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  const networks = getNetworks();
  const allGuidelines = getAllGuidelines();

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          CONSTELLATION MAP — 1 per language (4 total)
         ═══════════════════════════════════════════════════ */}
      {LANGUAGES.map((lang) => (
        <Composition
          key={`constellation-${lang}`}
          id={`ConstellationMap-${lang}`}
          component={ConstellationMap as unknown as React.FC<Record<string, unknown>>}
          durationInFrames={FPS * 35}
          fps={FPS}
          width={1920}
          height={1080}
          defaultProps={{ lang } as Record<string, unknown>}
        />
      ))}

      {/* ═══════════════════════════════════════════════════
          NETWORK EXPLORER — 1 per network × 4 langs (12 total)
         ═══════════════════════════════════════════════════ */}
      {networks.map((network) =>
        LANGUAGES.map((lang) => (
          <Composition
            key={`network-${network.id}-${lang}`}
            id={`Network-${network.id}-${lang}`}
            component={NetworkExplorer as unknown as React.FC<Record<string, unknown>>}
            durationInFrames={FPS * 25}
            fps={FPS}
            width={1920}
            height={1080}
            defaultProps={{ networkId: network.id, lang } as Record<string, unknown>}
          />
        ))
      )}

      {/* ═══════════════════════════════════════════════════
          GUIDELINE CLIPS — 1 per guideline × 4 langs (36 total)
         ═══════════════════════════════════════════════════ */}
      {allGuidelines.map((guideline) =>
        LANGUAGES.map((lang) => (
          <Composition
            key={`guideline-${guideline.code}-${lang}`}
            id={`Guideline-${guideline.code}-${lang}`}
            component={GuidelineClip as unknown as React.FC<Record<string, unknown>>}
            durationInFrames={FPS * 15}
            fps={FPS}
            width={1080}
            height={1080}
            defaultProps={{ guidelineCode: guideline.code, lang } as Record<string, unknown>}
          />
        ))
      )}
    </>
  );
};
