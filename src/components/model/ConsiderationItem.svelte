<script lang="ts">
  import { link } from 'svelte-spa-router';
  import type { Consideration, Guideline } from '../../types';
  import { language, t } from '../../stores/language';
  import { getGuidelineStyles } from '../../utils/colors';
  import type { Language } from '../../types';

  export let consideration: Consideration;
  export let guideline: Guideline;

  let currentLang: Language;
  language.subscribe((value) => {
    currentLang = value;
  });

  $: styles = getGuidelineStyles(guideline);
  
  // Create hover style
  $: hoverBg = guideline.color ? `rgba(${parseInt(guideline.color.slice(1,3), 16)}, ${parseInt(guideline.color.slice(3,5), 16)}, ${parseInt(guideline.color.slice(5,7), 16)}, 0.05)` : 'rgba(0,0,0,0.02)';
</script>

<a
  href="/detail/{consideration.id}"
  use:link
  class="block px-3 py-2 rounded-md transition-colors border-l-2"
  style="border-color: {guideline.color || '#ccc'}"
  on:mouseenter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
  on:mouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
>
  <div class="flex items-start gap-2">
    <span class="font-mono text-sm font-semibold shrink-0" style="{styles.text}">
      {consideration.code}
    </span>
    <span class="text-sm text-gray-700">
      {t(consideration.description, currentLang)}
    </span>
  </div>
</a>
