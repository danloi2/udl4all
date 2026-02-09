<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { udlData } from '../stores/udlData';
  import { language, t } from '../stores/language';
  import type { Network, Principle, Guideline, Consideration } from '../types';

  export let id: string = '';
  export let type: 'network' | 'principle' | 'guideline' | 'consideration' | 'custom' = 'custom';
  export let text: string = '';
  export let title: string = '';
  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  let content = '';
  let resolvedTitle = '';
  let color = '#374151'; // default gray-700

  $: {
    if (type === 'custom') {
      content = text;
      resolvedTitle = title;
    } else if ($udlData) {
      // Resolve content based on type and ID from udlData
      if (type === 'network') {
        const network = $udlData.networks.find((n: Network) => n.id === id);
        if (network) {
          content = network.description ? t(network.description, $language) : '';
          resolvedTitle = t(network.name, $language);
          color = network.color || '#374151';
        }
      } else if (type === 'principle') {
          // Principles are nested in networks in the store structure check
          let found: Principle | undefined;
          for (const n of $udlData.networks) {
              if (n.principle.id === id) {
                  found = n.principle;
                  break;
              }
          }
          if (found) {
               content = found.name ? t(found.name, $language) : ''; 
               resolvedTitle = found.name ? t(found.name, $language) : '';
               color = found.color || '#374151';
          }
      } else if (type === 'guideline') {
          // Guidelines are nested in principles
          let found: Guideline | undefined;
          let pColor = '#374151';
          for (const n of $udlData.networks) {
              const g = n.principle.guidelines.find((g: Guideline) => g.id === id || g.code === id);
              if (g) {
                  found = g;
                  pColor = n.principle.color || '#374151';
                  break;
              }
          }
          if (found) {
              content = found.name ? t(found.name, $language) : ''; // Guidelines just have name/pre
              resolvedTitle = found.name ? `${found.code}. ${t(found.name, $language)}` : found.code;
              color = pColor;
          }
      } else if (type === 'consideration') {
           // Considerations nested in guidelines
           let found: Consideration | undefined;
           let pColor = '#374151';
           for (const n of $udlData.networks) {
               for (const g of n.principle.guidelines) {
                   const c = g.considerations.find((c: Consideration) => c.id === id || c.code === id);
                   if (c) {
                       found = c;
                       pColor = n.principle.color || '#374151';
                       break;
                   }
               }
               if (found) break;
           }
           if (found) {
               content = found.description ? t(found.description, $language) : '';
               resolvedTitle = found.code;
               color = pColor;
           }
      }
    }
  }

  // Positioning classes
  $: positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }[position];
  
  let isHovered = false;
</script>

<div class="relative inline-block" 
     on:mouseenter={() => isHovered = true} 
     on:mouseleave={() => isHovered = false}
     role="tooltip">
  <slot />
  
  {#if isHovered && (content || resolvedTitle)}
    <div class="absolute z-50 w-64 p-4 text-sm bg-white rounded-xl shadow-xl border border-gray-100 pointer-events-none {positionClasses}"
         transition:fly={{ y: 5, duration: 200 }}>
        <!-- Arrow -->
        <div class="absolute w-3 h-3 bg-white border-br-gray-100 rotate-45 transform 
            {position === 'top' ? '-bottom-1.5 left-1/2 -translate-x-1/2 border-b border-r' : ''}
            {position === 'bottom' ? '-top-1.5 left-1/2 -translate-x-1/2 border-t border-l' : ''}
            {position === 'left' ? '-right-1.5 top-1/2 -translate-y-1/2 border-t border-r' : ''}
            {position === 'right' ? '-left-1.5 top-1/2 -translate-y-1/2 border-b border-l' : ''}
        "></div>
        
        <!-- Header -->
        {#if resolvedTitle}
            <h4 class="font-black uppercase tracking-wider mb-2 text-xs border-b pb-1" style="color: {color}; border-color: {color}30">
                {resolvedTitle}
            </h4>
        {/if}
        
        <!-- Body -->
        <p class="text-gray-600 font-medium leading-relaxed">
            {content}
        </p>
    </div>
  {/if}
</div>
