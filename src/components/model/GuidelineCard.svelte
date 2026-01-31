<script lang="ts">
  import type { Guideline } from '../../types';
  import { language, t } from '../../stores/language';
  import { getGuidelineStyles } from '../../utils/colors';
  import ConsiderationItem from './ConsiderationItem.svelte';
  import LevelBadge from './LevelBadge.svelte';
  import type { Language } from '../../types';
  import { getColorStyles } from '../../utils/colors';
  import { showConsiderations } from '../../stores/settings';
  import { slide } from 'svelte/transition';

  export let guideline: Guideline;
  export let principleColor: string = '#ccc';

  let currentLang: Language;
  language.subscribe((value) => {
    currentLang = value;
  });

  $: styles = getColorStyles(principleColor);
</script>

<div class="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
  <div class="px-5 py-4 border-b border-gray-100" style="border-top: 4px solid {principleColor}; {styles.bgLight}">
    <div class="flex items-start gap-4">
      <div 
        class="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl font-mono text-lg font-black shadow-inner" 
        style="background-color: {principleColor}; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.1)"
      >
        {guideline.code}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-bold leading-tight">
          {#if guideline.preDescription}
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">{t(guideline.preDescription, currentLang)}</span>
          {/if}
          <span class="text-base" style="color: {principleColor}">{t(guideline.name, currentLang)}</span>
        </h3>
      </div>
    </div>
    <div class="mt-4 flex justify-end">
      <LevelBadge row={guideline.row} {currentLang} />
    </div>
  </div>
  
  {#if $showConsiderations}
    <div class="p-3 space-y-1" transition:slide={{ duration: 300 }}>
      {#each guideline.considerations as consideration}
        <ConsiderationItem {consideration} {guideline} />
      {/each}
    </div>
  {/if}
</div>
