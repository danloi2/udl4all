<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { language, t } from '../stores/language';
  import { ui } from '../stores/ui';
  import { udlData, getConsiderationById, getGuidelineForConsideration, getPrincipleForConsideration, udlIndex } from '../stores/udlData';
  import LanguageSwitcher from '../components/LanguageSwitcher.svelte';
  import Breadcrumbs from '../components/Breadcrumbs.svelte';
  import Tag from '../components/Tag.svelte';
  import MarkdownRenderer from '../components/MarkdownRenderer.svelte';
  import LevelBadge from '../components/model/LevelBadge.svelte';
  import { ArrowLeft, LayoutGrid, Search } from 'lucide-svelte';
  import { getGuidelineStyles, getColorStyles } from '../utils/colors';
  import type { Language } from '../types';

  // Brain assets
  import affectiveLogo from '../assets/brains/affective_logo.svg';
  import recognitionLogo from '../assets/brains/recognition_logo.svg';
  import strategicLogo from '../assets/brains/strategic_logo.svg';

  const brainLogos = {
    affective: affectiveLogo,
    recognition: recognitionLogo,
    strategic: strategicLogo
  };

  export let params: { id: string } = { id: '' };

  let currentLang: Language;
  language.subscribe((value) => {
    currentLang = value;
  });

  $: itemData = (function() {
    const c = getConsiderationById(params.id, $udlIndex);
    if (c) {
      const g = getGuidelineForConsideration(params.id, $udlData);
      const p = getPrincipleForConsideration(params.id, $udlData);
      return { type: 'consideration', item: c, guideline: g, principle: p };
    }
    const g = $udlIndex.guidelines.get(params.id);
    if (g) {
      const p = $udlData.networks.find(n => n.principle.guidelines.some(gu => gu.id === g.id))?.principle;
      return { type: 'guideline', item: g, guideline: g, principle: p };
    }
    const p = $udlIndex.principles.get(params.id);
    if (p) {
      return { type: 'principle', item: p, guideline: null, principle: p };
    }
    return null;
  })();

  $: consideration = itemData?.type === 'consideration' ? itemData.item : null;
  $: guideline = itemData?.guideline;
  $: principle = itemData?.principle;
  
  $: networkId = principle ? $udlData.networks.find(n => n.principle.id === principle.id)?.id : undefined;
  $: logo = networkId ? brainLogos[networkId as keyof typeof brainLogos] : undefined;
  $: colors = guideline ? getGuidelineStyles(guideline) : (principle ? getColorStyles(principle.color || '#ccc') : undefined);

  $: breadcrumbItems = [
    { label: $ui.home, href: '/' },
    { label: $ui.viewCompleteModel, href: '/model' },
    ...(principle ? [{ label: t(principle.name, currentLang), href: `/detail/${principle.id}` }] : []),
    ...(guideline && itemData?.type !== 'guideline' ? [{ label: `${guideline.code}. ${t(guideline.name, currentLang)}`, href: `/detail/${guideline.id}` }] : []),
    ...(itemData?.type === 'guideline' && guideline ? [{ label: `${guideline.code}. ${t(guideline.name, currentLang)}` }] : []),
    ...(itemData?.type === 'consideration' && itemData.item ? [{ label: `${itemData.item.code}. ${t((itemData.item as any).description, currentLang)}` }] : []),
  ];

  // Fix scroll position when navigating between items
  $: if (params.id) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
</script>

<div class="min-h-screen bg-gray-50 pb-24">
  <!-- Header -->
  <div class="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a
            href="/model"
            use:link
            class="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors"
            title={$ui.viewCompleteModel}
          >
            <LayoutGrid class="w-5 h-5" />
          </a>
          <a
            href="/explore"
            use:link
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
            <span>{$ui.back}</span>
          </a>
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    {#if itemData && colors}
      <!-- Breadcrumbs -->
      <div class="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <!-- Main Card -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="px-8 py-8 border-b-4 relative overflow-hidden" 
             style="{colors.bgLight}; border-color: {principle?.color || '#ccc'}">
          <!-- Brain Illustration Background -->
          {#if logo}
            <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 w-32 h-32 pointer-events-none">
              <img src={logo} alt="" class="w-full h-full object-contain" />
            </div>
          {/if}

          <div class="relative z-10">
            <div class="flex items-center gap-4 mb-4">
              {#if itemData.type === 'consideration' && consideration}
                <span class="font-mono text-5xl font-black" style="{colors.text}">
                  {consideration.code}
                </span>
              {:else if itemData.type === 'guideline' && guideline}
                <span class="font-mono text-5xl font-black" style="{colors.text}">
                  {guideline.code}
                </span>
              {/if}
              <div class="flex flex-col gap-1">
                {#if principle?.color}
                  <Tag color={principle.color} 
                       label={(principle.preDescription ? t(principle.preDescription, currentLang) + ' ' : '') + t(principle.name, currentLang)} />
                {/if}
              </div>
            </div>
            <h1 class="text-3xl font-black text-gray-900 leading-tight max-w-2xl">
              {#if itemData.type === 'consideration' && consideration}
                {t(consideration.description, currentLang)}
              {:else if itemData.type === 'guideline' && guideline}
                {t(guideline.name, currentLang)}
              {:else if itemData.type === 'principle' && principle}
                {t(principle.name, currentLang)}
              {/if}
            </h1>
          </div>
        </div>

        <!-- Body -->
        <div class="px-8 py-8 space-y-8">
          <!-- Item Context / PreDescription -->
          {#if itemData.type === 'guideline' && guideline?.preDescription}
            <div class="bg-gray-50 border-l-4 p-4 italic text-gray-600 rounded-r-lg" style="border-color: {principle?.color || '#ccc'}">
              {t(guideline.preDescription, currentLang)}
            </div>
          {:else if itemData.type === 'principle' && principle?.preDescription}
            <div class="bg-gray-50 border-l-4 p-4 italic text-gray-600 rounded-r-lg" style="border-color: {principle.color || '#ccc'}">
              {t(principle.preDescription, currentLang)}
            </div>
          {/if}

          <!-- Network Description (for Principles) -->
          {#if itemData.type === 'principle' && networkId}
            {@const network = $udlData.networks.find(n => n.id === networkId)}
            {#if network}
              <div class="flex gap-6 items-start p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div class="w-16 h-16 shrink-0 bg-gray-50 rounded-xl p-2 border border-gray-100 shadow-inner">
                  <img src={logo} alt="" class="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 class="text-xs font-black uppercase tracking-widest mb-1" style="color: {principle?.color || '#666'}">
                    {t(network.name, currentLang)}
                  </h3>
                  <p class="text-gray-700 font-medium">
                    {t(network.description, currentLang)}
                  </p>
                </div>
              </div>
            {/if}
          {/if}

          <!-- Parent Guideline Info (for Considerations) -->
          {#if itemData.type === 'consideration' && guideline}
            <div class="rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow" 
                 style="border-top: 4px solid {principle?.color || '#ccc'}; {colors.bgLight}">
              <h2 class="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">{$ui.guideline}</h2>
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-4">
                  <span class="font-mono text-2xl font-black px-3 py-1 rounded-lg bg-white shadow-sm border border-gray-100" style="color: {principle?.color}">
                    {guideline.code}
                  </span>
                  <span class="text-xl font-bold" style="color: {principle?.color}">
                    {#if guideline.preDescription}
                      <span class="text-sm font-bold text-gray-400 block -mb-1">{t(guideline.preDescription, currentLang)}</span>
                    {/if}
                    {t(guideline.name, currentLang)}
                  </span>
                </div>
              </div>
              <div class="mt-4 flex justify-end border-t border-black/5 pt-4">
                <LevelBadge row={guideline.row} {currentLang} />
              </div>
            </div>
          {/if}

          <!-- Children List (Considerations for Guidelines, Guidelines for Principles) -->
          {#if itemData.type === 'guideline' && guideline?.considerations}
            <div class="space-y-4">
              <h2 class="text-sm font-black uppercase tracking-widest text-gray-500">{$ui.considerations}</h2>
              <div class="grid grid-cols-1 gap-2">
                {#each guideline.considerations as cond}
                  <a href="/detail/{cond.id}" use:link class="block p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm">
                    <div class="flex items-start gap-4">
                      <span class="font-mono font-black py-1 px-2 bg-gray-50 rounded border text-sm" style="color: {principle?.color}">
                        {cond.code}
                      </span>
                      <p class="text-gray-800 font-medium">{t(cond.description, currentLang)}</p>
                    </div>
                  </a>
                {/each}
              </div>
            </div>
          {:else if itemData.type === 'principle' && principle?.guidelines}
            <div class="space-y-4">
              <h2 class="text-sm font-black uppercase tracking-widest text-gray-500">{$ui.guidelines}</h2>
              <div class="grid grid-cols-1 gap-4">
                {#each principle.guidelines as g}
                  <a href="/detail/{g.id}" use:link class="block p-6 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm" 
                     style="border-left: 8px solid {principle.color}">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-4">
                        <span class="font-mono text-xl font-black py-1 px-3 bg-white rounded-lg border shadow-sm" style="color: {principle.color}">
                          {g.code}
                        </span>
                        <h3 class="text-lg font-black" style="color: {principle.color}">{t(g.name, currentLang)}</h3>
                      </div>
                      <LevelBadge row={g.row} {currentLang} />
                    </div>
                    {#if g.preDescription}
                      <p class="text-gray-600 text-sm italic">{t(g.preDescription, currentLang)}</p>
                    {/if}
                  </a>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Description (if enhanced with markdown in future) -->
          {#if itemData.type === 'consideration' && consideration}
            <div class="prose prose-lg max-w-none pt-4 border-t border-gray-100">
              <MarkdownRenderer content={t(consideration.description, currentLang)} />
            </div>
          {/if}
        </div>
      </div>

      <!-- Floating Navigation Buttons -->
      <div class="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <a
          href="/model"
          use:link
          class="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
          title={$ui.modelAction}
        >
          <LayoutGrid class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-black uppercase tracking-widest">{$ui.modelAction}</span>
        </a>
        
        <a
          href="/explore"
          use:link
          class="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white text-blue-600 border border-blue-100 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
          title={$ui.searchAction}
        >
          <Search class="w-6 h-6 mb-1" />
          <span class="text-[10px] font-black uppercase tracking-widest">{$ui.searchAction}</span>
        </a>
      </div>
    {:else}
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">{$ui.itemNotFound}</p>
        <a
          href="/"
          use:link
          class="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
        >
          {$ui.home}
        </a>
      </div>
    {/if}
  </div>
</div>
