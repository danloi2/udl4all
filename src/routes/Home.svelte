<script lang="ts">
    import { link } from 'svelte-spa-router';
  import { language, t } from '../stores/language';
  import { ui } from '../stores/ui';
  import { udlData } from '../stores/udlData';
  import LanguageSwitcher from '../components/LanguageSwitcher.svelte';
  import { LayoutGrid, Search } from 'lucide-svelte';
  import type { Language } from '../types';

  // Import assets
  import udlLogo from '../assets/brains/udl_logo.svg';
  import affectiveLogo from '../assets/brains/affective_logo.svg';
  import recognitionLogo from '../assets/brains/recognition_logo.svg';
  import strategicLogo from '../assets/brains/strategic_logo.svg';

  let currentLang: Language;
  language.subscribe((value) => {
    currentLang = value;
  });

</script>

<div class="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
  <!-- Header -->
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-end">
      <LanguageSwitcher />
    </div>
  </div>

  <!-- Hero Section -->
  <div class="container mx-auto px-4 py-8 md:py-16">
    <div class="text-center mb-12 flex flex-col items-center">
      <img src={udlLogo} alt="UDL Logo" class="w-48 h-48 md:w-64 md:h-64 mb-6 hover:scale-105 transition-transform duration-500" />
      <h1 class="text-5xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-700 via-purple-700 to-pink-700">
        {t($udlData.title, currentLang)}
      </h1>
      <p class="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
        {t($udlData.goal, currentLang)}
      </p>
    </div>


    <!-- Floating Navigation Buttons -->
    <div class="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      <a
        href="/model"
        use:link
        class="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
        title={$ui.viewAction}
      >
        <LayoutGrid class="w-6 h-6 mb-1" />
        <span class="text-[10px] font-black uppercase tracking-widest">{$ui.viewAction}</span>
      </a>
      
      <a
        href="/explore"
        use:link
        class="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-md text-blue-600 border border-white/20 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
        title={$ui.searchAction}
      >
        <Search class="w-6 h-6 mb-1" />
        <span class="text-[10px] font-black uppercase tracking-widest">{$ui.searchAction}</span>
      </a>
    </div>

    <!-- UDL Introduction Card with Colors -->
    <div class="max-w-5xl mx-auto">
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div class="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-10">
          <h2 class="text-3xl md:text-4xl font-bold text-white text-center">
            {$ui.whatIsUDL}
          </h2>
        </div>
        
        <div class="px-8 py-10 space-y-10">
          <p class="text-lg md:text-xl text-gray-700 leading-relaxed text-center max-w-3xl mx-auto font-medium">
            {$ui.udlDescription}
          </p>
          
          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="bg-white px-6 text-xl font-bold text-gray-900 uppercase tracking-widest italic">
                {$ui.udlPrinciples}
              </span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Engagement -->
            <div class="group relative flex flex-col items-center rounded-2xl p-6 bg-white border border-gray-100 hover:border-green-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div class="relative mb-6 w-24 h-24 flex items-center justify-center rounded-2xl bg-green-50 group-hover:bg-green-100 transition-colors">
                <img src={affectiveLogo} alt="Affective Network" class="w-16 h-16 object-contain" />
                <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-600 border-4 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">1</div>
              </div>
              {#if $udlData.networks[0].principle.preDescription}
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">
                  {t($udlData.networks[0].principle.preDescription, currentLang)}
                </p>
              {/if}
              <h3 class="text-xl font-bold mb-3 text-center" style="color: {$udlData.networks[0].color}">
                {t($udlData.networks[0].principle.name, currentLang)}
              </h3>
              <p class="text-sm text-gray-600 text-center font-medium leading-relaxed">
                {$ui.engagementWhy}
              </p>
            </div>
            
            <!-- Representation -->
            <div class="group relative flex flex-col items-center rounded-2xl p-6 bg-white border border-gray-100 hover:border-purple-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div class="relative mb-6 w-24 h-24 flex items-center justify-center rounded-2xl bg-purple-50 group-hover:bg-purple-100 transition-colors">
                <img src={recognitionLogo} alt="Recognition Network" class="w-16 h-16 object-contain" />
                <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-purple-600 border-4 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">2</div>
              </div>
              {#if $udlData.networks[1].principle.preDescription}
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">
                  {t($udlData.networks[1].principle.preDescription, currentLang)}
                </p>
              {/if}
              <h3 class="text-xl font-bold mb-3 text-center" style="color: {$udlData.networks[1].color}">
                {t($udlData.networks[1].principle.name, currentLang)}
              </h3>
              <p class="text-sm text-gray-600 text-center font-medium leading-relaxed">
                {$ui.representationWhat}
              </p>
            </div>
            
            <!-- Action & Expression -->
            <div class="group relative flex flex-col items-center rounded-2xl p-6 bg-white border border-gray-100 hover:border-blue-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div class="relative mb-6 w-24 h-24 flex items-center justify-center rounded-2xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <img src={strategicLogo} alt="Strategic Network" class="w-16 h-16 object-contain" />
                <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">3</div>
              </div>
              {#if $udlData.networks[2].principle.preDescription}
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">
                  {t($udlData.networks[2].principle.preDescription, currentLang)}
                </p>
              {/if}
              <h3 class="text-xl font-bold mb-3 text-center" style="color: {$udlData.networks[2].color}">
                {t($udlData.networks[2].principle.name, currentLang)}
              </h3>
              <p class="text-sm text-gray-600 text-center font-medium leading-relaxed">
                {$ui.actionExpressionHow}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
