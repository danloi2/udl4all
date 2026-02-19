/**
 * Batch render script for UDL4All videos
 *
 * Usage:
 *   npx tsx render.ts                          # render all constellation videos (es)
 *   npx tsx render.ts --type all --lang all     # render everything (52 videos)
 *   npx tsx render.ts --type constellation --lang es
 *   npx tsx render.ts --type network --lang en
 *   npx tsx render.ts --type guideline --lang eu
 */

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));
const typeFilter: string = args.type || 'constellation';
const langFilter: string = args.lang || 'es';

const LANGUAGES = ['es', 'en', 'eu', 'la'] as const;
const NETWORK_IDS = ['affective', 'recognition', 'strategic'] as const;
const GUIDELINE_CODES = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

interface RenderJob {
  compositionId: string;
  outputFile: string;
}

function getJobs(): RenderJob[] {
  const jobs: RenderJob[] = [];
  const langs = langFilter === 'all' ? [...LANGUAGES] : [langFilter];
  const types = typeFilter === 'all' ? ['constellation', 'network', 'guideline'] : [typeFilter];

  for (const lang of langs) {
    if (types.includes('constellation')) {
      jobs.push({
        compositionId: `ConstellationMap-${lang}`,
        outputFile: `out/constellation/ConstellationMap-${lang}.mp4`,
      });
    }

    if (types.includes('network')) {
      for (const nid of NETWORK_IDS) {
        jobs.push({
          compositionId: `Network-${nid}-${lang}`,
          outputFile: `out/network/Network-${nid}-${lang}.mp4`,
        });
      }
    }

    if (types.includes('guideline')) {
      for (const code of GUIDELINE_CODES) {
        jobs.push({
          compositionId: `Guideline-${code}-${lang}`,
          outputFile: `out/guideline/Guideline-${code}-${lang}.mp4`,
        });
      }
    }
  }

  return jobs;
}

async function main() {
  const jobs = getJobs();
  console.log(`\n🎬 UDL4All Video Renderer`);
  console.log(`   Type: ${typeFilter} | Lang: ${langFilter}`);
  console.log(`   Jobs: ${jobs.length} videos to render\n`);

  // Bundle the Remotion project
  console.log('📦 Bundling Remotion project...');
  const bundled = await bundle(path.resolve('./src/index.ts'));
  console.log('✅ Bundle ready\n');

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    console.log(`🎥 [${i + 1}/${jobs.length}] Rendering ${job.compositionId}...`);

    // Ensure output directory exists
    const outDir = path.dirname(job.outputFile);
    fs.mkdirSync(outDir, { recursive: true });

    try {
      const composition = await selectComposition({
        serveUrl: bundled,
        id: job.compositionId,
      });

      await renderMedia({
        composition,
        serveUrl: bundled,
        codec: 'h264',
        outputLocation: job.outputFile,
      });

      console.log(`   ✅ ${job.outputFile}`);
    } catch (err) {
      console.error(`   ❌ Failed: ${(err as Error).message}`);
    }
  }

  console.log(`\n🎉 Done! ${jobs.length} videos rendered to ./out/\n`);
}

main().catch(console.error);
