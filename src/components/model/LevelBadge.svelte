<script lang="ts">
  import { t } from '../../stores/language';
  import type { MultilingualText, Language } from '../../types';
  import { Key, LifeBuoy, Brain } from 'lucide-svelte';

  let { row, currentLang }: { row: MultilingualText, currentLang: Language } = $props();

  const label = $derived(t(row, currentLang));
  
  const config = $derived.by(() => {
    const l = label.toLowerCase();
    if (l.includes('acceso') || l.includes('access')) {
      return { icon: Key };
    } else if (l.includes('apoyo') || l.includes('support')) {
      return { icon: LifeBuoy };
    } else {
      return { icon: Brain };
    }
  });

  const Icon = $derived(config.icon);
</script>

<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-900 shadow-xs group-hover:border-gray-300 transition-colors">
  <Icon class="w-3.5 h-3.5" />
  <span class="text-[10px] font-black uppercase tracking-wider">{label}</span>
</div>
