<script lang="ts">
  import { udlData } from '../stores/udlData';
  import { ui } from '../stores/ui';
  import LanguageSwitcher from '../components/LanguageSwitcher.svelte';
  import { language, t } from '../stores/language';
  import PrincipleHeader from '../components/model/PrincipleHeader.svelte';
  import GuidelineCard from '../components/model/GuidelineCard.svelte';
  import FloatingNavigation from '../components/FloatingNavigation.svelte';
  import Breadcrumbs from '../components/Breadcrumbs.svelte';
  import { Home, LayoutGrid } from 'lucide-svelte';
  import { showConsiderations } from '../stores/settings';


  // Breadcrumbs
  $: breadcrumbItems = [
    { label: '', href: '/', icon: Home },
    { label: $ui.modelAction, icon: LayoutGrid }
  ];
</script>

<div class="min-h-screen bg-gray-50 pb-20">
  <!-- Header -->
  <div class="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex-1 min-w-0 mr-4">
           <Breadcrumbs items={breadcrumbItems} />
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  </div>

  <!-- 3x3 Grid Layout -->
  <div class="container mx-auto px-4 print-model-container print-landscape {$showConsiderations ? 'show-cons' : 'hide-cons'}">
    <!-- Page Header (Title & Meta) -->
     <div class="text-center mb-8 print-header-container print:mb-2">
       <div class="flex items-center justify-center gap-4 flex-wrap mb-2 print:mb-0 print:gap-1">
          <h1 class="font-black text-gray-900 tracking-tight app-model-title text-2xl md:text-4xl print:text-lg print:leading-none">
            {t($udlData.terminology.principle.title, $language) || $ui.appTitle}
          </h1>
         
         <div class="flex items-center gap-2 app-model-meta print:gap-1">
           <span class="px-3 py-1 bg-blue-50 text-blue-700 font-black rounded-full border border-blue-100 uppercase tracking-wide print:bg-transparent print:border-none app-model-version text-xs md:text-sm print:text-[14px] print:px-0 print:py-0 print:leading-none">
             {t($udlData.version, $language)}
           </span>
           
           <a 
              href="https://udlguidelines.cast.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-700 hover:scale-105 transition-all shadow-md group print:hidden"
            >
              <span class="font-black uppercase tracking-widest whitespace-nowrap app-model-cast text-xs md:text-sm">CAST (2024)</span>
            </a>
            <!-- Print-only CAST text -->
            <span class="hidden print:inline-block font-black uppercase tracking-widest whitespace-nowrap text-[10px] text-gray-500 print:leading-none">CAST (2024)</span>
         </div>
       </div>

       <!-- UDL Goal Description -->
       <p class="text-sm md:text-base text-gray-600 font-medium max-w-full mx-auto leading-tight app-model-goal print:text-[14px] print:text-gray-500 print:-mt-1 print:leading-none">
         {t($udlData.goal, $language)}
       </p>
    </div>
    <!-- Desktop Grid (3x3 Principles + Guidelines) -->
    <!-- Row-based grid for desktop screen view -->
    <div class="hidden lg:grid grid-cols-3 gap-x-12 gap-y-8 items-stretch print:hidden">
      <!-- Headers Row -->
      {#each $udlData.networks as network}
        <div class="rounded-xl shadow-lg border-b-4 h-full" style="border-color: {network.principle.color}">
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

    <!-- Print Optimized Layout (Column-based for maximum vertical density) -->
    <div class="hidden print:grid grid-cols-3 gap-2 items-start">
      {#each $udlData.networks as network}
        <div class="flex flex-col gap-2">
          <!-- Header -->
          <div class="rounded-lg overflow-hidden border-b-2" style="border-color: {network.principle.color}">
            <PrincipleHeader {network} currentLang={$language} />
          </div>
          <!-- Guidelines Stack -->
          {#each network.principle.guidelines as guideline}
            <GuidelineCard 
              {guideline} 
              principleColor={network.principle.color} 
            />
          {/each}
        </div>
      {/each}
    </div>

    <!-- Mobile Vertical View -->
    <div class="lg:hidden flex flex-col gap-12">
      {#each $udlData.networks as network}
        <div class="flex flex-col gap-4">
          <div class="rounded-xl shadow-lg border-b-4" style="border-color: {network.principle.color}">
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

  <FloatingNavigation currentPage="model" />
</div>
