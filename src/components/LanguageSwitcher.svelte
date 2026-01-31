<script lang="ts">
  import { language } from '../stores/language';
  import type { Language } from '../types';
  import { Globe } from 'lucide-svelte';

  const languages: { code: Language; label: string }[] = [
    { code: 'es', label: 'Español' },
    { code: 'eu', label: 'Euskara' },
    { code: 'en', label: 'English' },
    { code: 'la', label: 'Latina' },
  ];

  let currentLang: Language;
  language.subscribe((value) => {
    currentLang = value;
  });

  function setLanguage(lang: Language) {
    language.set(lang);
  }
</script>

<div class="flex items-center gap-2">
  <Globe class="w-5 h-5 text-gray-600" />
  <div class="flex gap-1 bg-gray-100 rounded-lg p-1">
    {#each languages as lang}
      <button
        class="px-3 py-1 rounded-md text-sm font-medium transition-all {currentLang === lang.code
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'}"
        on:click={() => setLanguage(lang.code)}
      >
        {lang.label}
      </button>
    {/each}
  </div>
</div>
