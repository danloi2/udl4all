<script lang="ts">
  import { udlData } from '../stores/udlData';
  import { ui } from '../stores/ui';
  import LanguageSwitcher from '../components/LanguageSwitcher.svelte';
  import { language, t } from '../stores/language';
  import PrincipleHeader from '../components/model/PrincipleHeader.svelte';
  import GuidelineCard from '../components/model/GuidelineCard.svelte';
  import { ArrowLeft, Eye, EyeOff } from 'lucide-svelte';
  import { link } from 'svelte-spa-router';
  import { showConsiderations } from '../stores/settings';
</script>

<div class="min-h-screen bg-gray-50 pb-20">
  <!-- Header -->
  <div class="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <a
          href="/"
          use:link
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
          <span>{$ui.home}</span>
        </a>
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-black text-gray-900">{$ui.appTitle}</h1>
          <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full border border-blue-200">
            {$ui.versionLabel}
          </span>
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  </div>

  <!-- 3x3 Grid Layout -->
  <div class="container mx-auto px-4 pt-10">
    <!-- Desktop Grid (3x3 Principles + Guidelines) -->
    <div class="hidden lg:grid grid-cols-3 gap-x-12 gap-y-8 items-stretch">
      <!-- Headers Row -->
      {#each $udlData.networks as network}
        <div class="rounded-xl overflow-hidden shadow-lg border-b-4 h-full" style="border-color: {network.principle.color}">
          <PrincipleHeader {network} currentLang={$language} />
        </div>
      {/each}

      <!-- Guideline Rows (Loop over 3 UDL Levels) -->
      {#each [0, 1, 2] as rowIndex}
        {#each $udlData.networks as network}
          <div class="h-full flex flex-col">
            {#if network.principle.guidelines[rowIndex]}
              <GuidelineCard 
                guideline={network.principle.guidelines[rowIndex]} 
                principleColor={network.principle.color} 
              />
            {/if}
          </div>
        {/each}
      {/each}
    </div>

    <!-- Mobile Vertical View -->
    <div class="lg:hidden flex flex-col gap-12">
      {#each $udlData.networks as network}
        <div class="flex flex-col gap-4">
          <div class="rounded-xl overflow-hidden shadow-lg border-b-4" style="border-color: {network.principle.color}">
            <PrincipleHeader {network} currentLang={$language} />
          </div>
          <div class="space-y-4 px-2">
            {#each network.principle.guidelines as guideline}
              <GuidelineCard {guideline} principleColor={network.principle.color} />
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Floating Action Button (FAB) -->
  <div class="fixed bottom-8 right-8 z-50">
    <button
      on:click={() => showConsiderations.update(v => !v)}
      class="group relative flex flex-col items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
      title={$showConsiderations ? $ui.hideConsiderations : $ui.showConsiderations}
    >
      <!-- Tooltip -->
      <span class="absolute right-full mr-4 px-3 py-1.5 bg-gray-900/80 backdrop-blur text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {$showConsiderations ? $ui.hideConsiderations : $ui.showConsiderations}
      </span>

      {#if $showConsiderations}
        <EyeOff class="w-6 h-6 mb-1" />
        <span class="text-[10px] font-black uppercase tracking-widest">{$ui.hideAction}</span>
      {:else}
        <Eye class="w-6 h-6 mb-1" />
        <span class="text-[10px] font-black uppercase tracking-widest">{$ui.showAction}</span>
      {/if}
    </button>
  </div>
</div>
