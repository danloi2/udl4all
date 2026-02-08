<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { language, t, tl } from '../stores/language';
  import { ui } from '../stores/ui';
  import { 
    udlData, 
    getConsiderationById, 
    getGuidelineForConsideration, 
    getPrincipleForConsideration, 
    udlIndex, 
    getExampleById, 
    getConsiderationForExample,
    getActivityById
  } from '../stores/udlData';
  import LanguageSwitcher from '../components/LanguageSwitcher.svelte';
  import Breadcrumbs from '../components/Breadcrumbs.svelte';
  import Tag from '../components/Tag.svelte';
  import MarkdownRenderer from '../components/MarkdownRenderer.svelte';
  import LevelBadge from '../components/model/LevelBadge.svelte';
  import { ArrowLeft, LayoutGrid, Search, Home, Lightbulb } from 'lucide-svelte';
  import FloatingNavigation from '../components/FloatingNavigation.svelte';
  import { getGuidelineStyles, getColorStyles } from '../utils/colors';
  import type { Language, Consideration, Guideline, Principle, Example, Activity } from '../types';

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
    // Check for Activity first
    const a = getActivityById(params.id, $udlIndex);
    if (a) {
        return { type: 'activity', item: a };
    }

    const e = getExampleById(params.id, $udlIndex);
    if (e) {
      const c = getConsiderationForExample(params.id, $udlIndex);
      if (c) {
        const g = getGuidelineForConsideration(c.id, $udlData);
        const p = getPrincipleForConsideration(c.id, $udlData);
        return { type: 'example', item: e, consideration: c, guideline: g, principle: p };
      }
    }
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

  $: activity = itemData?.type === 'activity' ? (itemData.item as Activity) : null;
  $: example = itemData?.type === 'example' ? (itemData.item as Example) : null;
  $: consideration = itemData?.type === 'consideration' ? (itemData.item as Consideration) : (itemData?.type === 'example' ? (itemData as any).consideration as Consideration : null);
  $: guideline = itemData?.guideline as Guideline | null;
  $: principle = itemData?.principle as Principle | null;
  
  $: networkId = principle ? $udlData.networks.find(n => n.principle.id === principle.id)?.id : undefined;
  $: logo = networkId ? brainLogos[networkId as keyof typeof brainLogos] : undefined;
  $: colors = guideline ? getGuidelineStyles(guideline) : (principle ? getColorStyles(principle.color || '#ccc') : undefined);

  const truncate = (text: string, length: number = 40) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  $: breadcrumbItems = [
    { label: '', href: '/', icon: Home },
    { label: $ui.modelAction, href: '/model', icon: LayoutGrid },
    ...(principle ? [{
      label: itemData?.type === 'principle' ? t(principle.name, currentLang) : (principle.id === 'engagement' ? 'C' : principle.id === 'representation' ? 'R' : 'A'),
      href: `/detail/${principle.id}`
    }] : []),
    ...(guideline && itemData?.type !== 'principle' ? [{ 
      label: `${guideline.code}. ${t(guideline.name, currentLang)}`, 
      href: `/detail/${guideline.id}` 
    }] : []),
    ...(consideration && (itemData?.type === 'consideration' || itemData?.type === 'example') ? [{ 
      label: itemData?.type === 'consideration' ? `${consideration.code}. ${t(consideration.description, currentLang)}` : consideration.code, 
      href: `/detail/${consideration.id}` 
    }] : []),
    ...(itemData?.type === 'example' && example ? [{ 
      label: `${example.code}. ${truncate(t(example.activity, currentLang), 50)}` 
    }] : []),
  ];

  // Fix scroll position when navigating between items
  $: if (params.id) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Custom sort: Engagement (7,8,9) -> Representation (1,2,3) -> Action & Expression (4,5,6)
  function sortAdaptations(adaptations: Record<string, any>) {
      const getPriority = (guidelineNum: number) => {
          if (guidelineNum >= 7 && guidelineNum <= 9) return 0; // Engagement
          if (guidelineNum >= 1 && guidelineNum <= 3) return 1; // Representation
          if (guidelineNum >= 4 && guidelineNum <= 6) return 2; // Action & Expression
          return 3;
      };

      return Object.entries(adaptations).sort(([codeA], [codeB]) => {
          const [a1, a2] = codeA.split('.').map(Number);
          const [b1, b2] = codeB.split('.').map(Number);
          
          const p1 = getPriority(a1);
          const p2 = getPriority(b1);

          if (p1 !== p2) return p1 - p2; // Sort by Principle
          if (a1 !== b1) return a1 - b1; // Then by Guideline
          return a2 - b2; // Then by Consideration
      });
  }

  // Group adaptations by Principle > Guideline
  function groupAdaptations(adaptations: Record<string, any>) {
      const sorted = sortAdaptations(adaptations);
      const result: { principle: Principle, guidelines: { guideline: Guideline, items: [string, any][] }[] }[] = [];
      
      sorted.forEach(([code, adaptation]) => {
         // Skip empty adaptations if needed? No, user wants to see them (skeletons). 
         // But wait, if text is empty? 02_pri_mat has empty texts. 
         // Logic so far displayed everything. Maintaining that.
         
         const cons = getConsiderationByCode(code);
         if (!cons) return;
         const p = getPrincipleForConsideration(cons.id, $udlData);
         const g = getGuidelineForConsideration(cons.id, $udlData);
         if (!p || !g) return;

         let pGroup = result.find(pg => pg.principle.id === p.id);
         if (!pGroup) {
             pGroup = { principle: p, guidelines: [] };
             result.push(pGroup);
         }
         
         let gGroup = pGroup.guidelines.find(gg => gg.guideline.id === g.id);
         if (!gGroup) {
             gGroup = { guideline: g, items: [] };
             pGroup.guidelines.push(gGroup);
         }
         
         gGroup.items.push([code, adaptation]);
      });
      
      return result;
  }


  // Helper to get Consideration for a code (e.g. "7.1")
  function getConsiderationByCode(code: string) {
      for (const [id, cons] of $udlIndex.considerations) {
          if (cons.code === code) return cons;
      }
      return null;
  }
</script>

<div class="min-h-screen bg-gray-50 pb-24">
  <!-- Header -->
  <div class="border-b border-gray-200 sticky top-0 z-20 shadow-sm transition-colors duration-300" style="{colors ? colors.bgLight : 'background-color: white'}">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex-1 min-w-0 mr-4">
           {#if activity}
               <Breadcrumbs items={[
                  { label: '', href: '/', icon: Home },
                  { label: $ui.modelAction, href: '/model', icon: LayoutGrid },
                  { label: activity.code }
               ]} />
           {:else}
              <Breadcrumbs items={breadcrumbItems} color={principle?.color} />
           {/if}
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="container mx-auto px-4 py-8 max-w-4xl {itemData?.type === 'activity' || itemData?.type === 'example' ? 'print-multi-page' : 'print-portrait-compact'}">
    {#if itemData}
      {#if itemData.type === 'activity' && activity}
        <!-- Activity Full View -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
             <!-- Header -->
             <div class="px-8 py-8 border-b-4 bg-gray-50 border-gray-300 relative overflow-hidden">
                  <div class="relative z-10">
                      <div class="flex items-center gap-4 mb-4">
                          <span class="font-mono text-3xl font-black text-gray-400">
                              {activity.code}
                          </span>
                           <div class="flex gap-2">
                               <span class="px-2 py-1 text-xs font-black uppercase tracking-wider rounded-md border bg-gray-100 text-gray-700 border-gray-200">
                                   {t(activity.gradeLevel, currentLang)}
                               </span>
                               <span class="px-2 py-1 text-xs font-black uppercase tracking-wider rounded-md border bg-gray-100 text-gray-700 border-gray-200">
                                   {t(activity.subject, currentLang)}
                               </span>
                           </div>
                      </div>
                      <h1 class="text-3xl font-black text-gray-900 leading-tight max-w-2xl">
                          {t(activity.title, currentLang)}
                      </h1>
                  </div>
             </div>
             
             <!-- Body -->
             <div class="px-8 py-8 space-y-12">
                 <!-- Adaptations List -->
                 <div class="space-y-12">
                     <h2 class="text-xl font-black uppercase tracking-widest text-gray-900 flex items-center gap-3">
                         <LayoutGrid class="w-6 h-6" />
                         {$ui.examples} / Adaptaciones
                     </h2>
                     
                     <div class="space-y-12">
                          {#each groupAdaptations(activity.duaAdaptations) as pGroup}
                            <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 bg-white rounded-3xl p-6 border-2 border-dashed border-gray-100">
                                <!-- Principle Header -->
                                <h3 class="text-2xl font-black uppercase tracking-wider flex items-center gap-3" style="color: {pGroup.principle.color}">
                                    <span class="w-3 h-10 rounded-full" style="background-color: {pGroup.principle.color}"></span>
                                    {t(pGroup.principle.name, currentLang)}
                                </h3>
                                
                                <div class="space-y-8 pl-4 lg:pl-8">
                                   {#each pGroup.guidelines as gGroup}
                                      <div class="space-y-4">
                                         <!-- Guideline Header -->
                                         <div class="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl w-fit">
                                            <span class="font-mono text-xl font-black px-3 py-1 rounded-lg text-white shadow-sm" style="background-color: {pGroup.principle.color}">
                                               {gGroup.guideline.code}
                                            </span>
                                            <h4 class="text-lg font-bold text-gray-800">
                                               {t(gGroup.guideline.name, currentLang)}
                                            </h4>
                                         </div>
                                         
                                         <!-- Items Grid -->
                                         <div class="grid grid-cols-1 gap-6 border-l-4 pl-6" style="border-color: {pGroup.principle.color}20">
                                            {#each gGroup.items as [code, adaptation]}
                                               {@const cons = getConsiderationByCode(code)}
                                               
                                               <div class="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all bg-white hover:border-blue-200">
                                                   <!-- Badge -->
                                                   <div class="shrink-0 flex md:flex-col items-center gap-3">
                                                       <div class="w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-lg font-black text-white shadow-sm"
                                                            style="background-color: {pGroup.principle.color}">
                                                           {code}
                                                       </div>
                                                   </div>
                                                   
                                                   <!-- Content -->
                                                   <div class="space-y-3 grow">
                                                       {#if cons}
                                                           <h5 class="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">
                                                               {t(cons.description, currentLang)}
                                                           </h5>
                                                       {/if}
                                                       
                                                       <div class="space-y-3">
                                                           {#each tl(adaptation.text, currentLang) as paragraph}
                                                              {#if paragraph.trim()}
                                                                <div class="flex gap-3 items-start">
                                                                    <Lightbulb class="w-5 h-5 shrink-0 mt-0.5" style="color: {pGroup.principle.color}" />
                                                                    <p class="text-gray-800 font-medium leading-relaxed text-lg">
                                                                        {paragraph}
                                                                    </p>
                                                                </div>
                                                              {/if}
                                                           {/each}
                                                       </div>
                        
                                                       {#if adaptation.webTools && adaptation.webTools.length > 0}
                                                           <div class="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                                                               <span class="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 self-center">{$ui.webTools}:</span>
                                                               {#each adaptation.webTools as tool}
                                                                   <a href={tool.url} target="_blank" rel="noopener noreferrer" 
                                                                      class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-white border border-gray-200 hover:border-blue-400 rounded-lg transition-all group shadow-sm">
                                                                       {#if tool.logo}
                                                                           <img src={tool.logo} alt="" class="w-4 h-4 object-contain" />
                                                                       {/if}
                                                                       <span class="text-xs font-bold text-gray-700 group-hover:text-blue-600">
                                                                           {tool.name}
                                                                       </span>
                                                                   </a>
                                                               {/each}
                                                           </div>
                                                       {/if}
                                                   </div>
                                               </div>
                                            {/each}
                                         </div>
                                      </div>
                                   {/each}
                                </div>
                            </div>
                          {/each}
                      </div>
                 </div>
             </div>
        </div>
      {:else if colors}
        <!-- Standard View (Principle/Guideline/Consideration/Example) -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Header -->
          <div class="px-8 py-8 border-b-4 relative overflow-hidden" 
               style="{colors.bgLight}; border-color: {principle?.color || '#ccc'}">
            
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
                         label={itemData.type === 'principle' && principle.preDescription 
                           ? t(principle.preDescription, currentLang).trim() 
                           : (principle.preDescription ? t(principle.preDescription, currentLang) + ' ' : '') + t(principle.name, currentLang)} />
                  {/if}
                </div>
              </div>
              <h1 class="text-3xl font-black text-gray-900 leading-tight max-w-2xl">
                {#if itemData.type === 'example' && example}
                  {example.code}. {t(example.activity, currentLang)}
                {:else if itemData.type === 'consideration' && consideration}
                  {t(consideration.description, currentLang)}
                {:else if itemData.type === 'guideline' && guideline}
                  {#if guideline.preDescription}
                    <span class="text-sm font-bold text-gray-500 block mb-1">{t(guideline.preDescription, currentLang)}</span>
                  {/if}
                  {t(guideline.name, currentLang)}
                {:else if itemData.type === 'principle' && principle}
                  {t(principle.name, currentLang)}
                {/if}
              </h1>
            </div>
          </div>

          <!-- Body -->
          <div class="px-8 py-8 space-y-8">
            {#if itemData.type === 'example' && example}
              <!-- Example Details -->
              <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="p-6 rounded-2xl border" style="background-color: {principle?.color}10; border-color: {principle?.color}30">
                    <h3 class="text-xs font-black uppercase tracking-widest mb-4" style="color: {principle?.color}">{$ui.educationalLevel}</h3>
                    <div class="flex items-center gap-3">
                      <div class="p-3 bg-white rounded-xl shadow-sm border" style="border-color: {principle?.color}30">
                        <Search class="w-6 h-6" style="color: {principle?.color}" />
                      </div>
                      <span class="text-xl font-bold text-gray-900">{t(example.educationalLevel, currentLang)}</span>
                    </div>
                  </div>
                  <div class="p-6 rounded-2xl border" style="background-color: {principle?.color}10; border-color: {principle?.color}30">
                    <h3 class="text-xs font-black uppercase tracking-widest mb-4" style="color: {principle?.color}">{$ui.curricularArea}</h3>
                    <div class="flex items-center gap-3">
                      <div class="p-3 bg-white rounded-xl shadow-sm border" style="border-color: {principle?.color}30">
                        <LayoutGrid class="w-6 h-6" style="color: {principle?.color}" />
                      </div>
                      <span class="text-xl font-bold text-gray-900">{t(example.curricularArea, currentLang)}</span>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <div class="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm relative overflow-hidden group">
                     <div class="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <span class="text-9xl font-black italic select-none">{$ui.udlAcronym}</span>
                     </div>
                     <div class="relative z-10">
                      <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">{$ui.activity}</h3>
                      <p class="text-2xl font-bold text-gray-900 leading-relaxed italic">
                        " {t(example.activity, currentLang)} "
                      </p>
                     </div>
                  </div>
                  <div class="p-8 rounded-3xl text-white shadow-xl relative overflow-hidden"
                       style="background-color: {principle?.color || '#1a1a1a'}">
                     <div class="relative z-10">
                      <h3 class="text-xs font-black uppercase tracking-widest text-white/60 mb-4">{$ui.designOptions}</h3>
                      <div class="prose prose-invert prose-lg max-w-none">
                        <div class="space-y-4">
                          {#each tl(example.designOptions, currentLang) as paragraph}
                            <p class="text-white font-bold leading-relaxed">
                              {paragraph}
                            </p>
                          {/each}
                        </div>
                      </div>

                      {#if example.webTools && example.webTools.length > 0}
                        <div class="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
                          {#each example.webTools as tool}
                            <a href={tool.url} target="_blank" rel="noopener noreferrer" 
                               class="flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-400 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md hover:scale-110">
                              {#if tool.logo}
                                <img src={tool.logo} alt="" class="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-125" />
                              {/if}
                              <span class="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                                {tool.name}
                              </span>
                            </a>
                          {/each}
                        </div>
                      {/if}
                     </div>
                  </div>
                </div>

                {#if consideration}
                  <div class="pt-8 border-t border-gray-100">
                    <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">{$ui.consideration}</h3>
                    <a href="/detail/{consideration.id}" use:link class="flex items-center gap-6 p-6 rounded-2xl bg-white border border-gray-100 hover:border-blue-400 hover:shadow-lg transition-all group">
                      <div class="w-16 h-16 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform">
                        <span class="font-mono text-xl font-black" style="color: {principle?.color}">{consideration.code}</span>
                      </div>
                      <div>
                        <p class="text-gray-900 font-bold text-lg group-hover:text-blue-600 transition-colors">
                          {t(consideration.description, currentLang)}
                        </p>
                        {#if guideline}
                          <p class="text-gray-500 text-sm mt-1">{guideline.code}. {t(guideline.name, currentLang)}</p>
                        {/if}
                      </div>
                    </a>
                  </div>
                {/if}
              </div>
            {:else}
              <!-- Guidelines and Considerations content -->
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
                      <p class="text-gray-700 font-medium">{t(network.description, currentLang)}</p>
                    </div>
                  </div>
                {/if}
              {/if}

              {#if itemData.type === 'consideration' && guideline}
                <div class="rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow" 
                     style="border-top: 4px solid {principle?.color || '#ccc'}; {colors.bgLight}">
                  <h2 class="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">{$ui.guideline}</h2>
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
                  <div class="mt-4 flex justify-end border-t border-black/5 pt-4">
                    <LevelBadge row={guideline.row} {currentLang} />
                  </div>
                </div>
              {/if}

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
                            <div>
                              {#if g.preDescription}
                                <p class="text-gray-500 text-xs italic mb-0.5">{t(g.preDescription, currentLang)}</p>
                              {/if}
                              <h3 class="text-lg font-black leading-tight" style="color: {principle.color}">{t(g.name, currentLang)}</h3>
                            </div>
                          </div>
                          <LevelBadge row={g.row} {currentLang} />
                        </div>
                      </a>
                    {/each}
                  </div>
                </div>
              {/if}

              {#if guideline && itemData.type !== 'guideline'}
                <!-- Second level examples (from guideline and activity mapping) -->
                {@const allExamples = Array.from($udlIndex.examples.values())}
                {@const relevantExamples = allExamples.filter(e => {
                  if (itemData.type === 'consideration' && consideration) {
                    const c = getConsiderationForExample(e.id, $udlIndex);
                    return c && c.id === consideration.id;
                  }
                  const c = getConsiderationForExample(e.id, $udlIndex);
                  if (!c) return false;
                  const g = getGuidelineForConsideration(c.id, $udlData);
                  return g && g.id === guideline.id;
                })}
                
                {#if relevantExamples.length > 0}
                  <div class="pt-8 print:pt-4 border-t border-gray-100">
                    <div class="flex items-center justify-between mb-6 print-break-after-avoid">
                      <h2 class="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <span class="w-2 h-8 rounded-full" style="background-color: {principle?.color}"></span>
                        {$ui.examples}
                      </h2>
                    </div>
                    <div class="grid grid-cols-1 gap-6">
                      {#each relevantExamples as example}
                        <div class="block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all group relative">
                          <a href="/detail/{example.id}" use:link class="absolute inset-0 z-0 shadow-inner group-hover:bg-blue-50/10 transition-colors" aria-label={$ui.viewAction}></a>
                          <div class="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap gap-2 items-center justify-between relative z-10 pointer-events-none">
                            <div class="flex items-center gap-3">
                              <span class="font-mono text-sm font-black" style="color: {example.color}">{example.code}</span>
                              <div class="flex gap-2">
                                <span class="px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border bg-gray-100 text-gray-700 border-gray-200">{t(example.educationalLevel, currentLang)}</span>
                                <span class="px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border bg-gray-100 text-gray-700 border-gray-200">{t(example.curricularArea, currentLang)}</span>
                              </div>
                            </div>
                          </div>
                          <div class="p-6 relative z-10">
                            <div class="text-gray-700 leading-relaxed font-medium pointer-events-none mb-4">
                              <div class="mb-2"><span class="font-bold">{$ui.activity}:</span> {t(example.activity, currentLang)}</div>
                              <div>
                                <span class="font-bold">{$ui.designOptions}:</span>
                                <div class="mt-1 space-y-2">
                                  {#each tl(example.designOptions, currentLang) as paragraph}
                                    <p>{paragraph}</p>
                                  {/each}
                                </div>
                              </div>
                            </div>

                            {#if example.webTools && example.webTools.length > 0}
                              <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-50 relative z-20">
                                {#each example.webTools as tool}
                                  <a href={tool.url} target="_blank" rel="noopener noreferrer" 
                                     class="flex items-center gap-2 px-2 py-1 bg-white hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-lg transition-all group shadow-sm">
                                    {#if tool.logo}
                                      <img src={tool.logo} alt="" class="w-4 h-4 object-contain transition-transform duration-300 group-hover:scale-125" />
                                    {/if}
                                    <span class="text-[11px] font-bold text-gray-600 group-hover:text-blue-600">
                                      {tool.name}
                                    </span>
                                  </a>
                                {/each}
                              </div>
                            {/if}
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}
              {/if}
            {/if}
          </div>
        </div>
      {/if}
      <FloatingNavigation currentPage="detail" />
    {:else}
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">{$ui.itemNotFound}</p>
        <a href="/" use:link class="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium">{$ui.home}</a>
      </div>
    {/if}
  </div>
</div>
