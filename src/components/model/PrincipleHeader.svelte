<script lang="ts">
  import type { Network, Language } from '../../types';
  import { t } from '../../stores/language';

  // Brain assets
  import affectiveLogo from '../../assets/brains/affective_logo.svg';
  import recognitionLogo from '../../assets/brains/recognition_logo.svg';
  import strategicLogo from '../../assets/brains/strategic_logo.svg';

  export let network: Network;
  export let currentLang: Language;

  const brainLogos = {
    affective: affectiveLogo,
    recognition: recognitionLogo,
    strategic: strategicLogo
  };

  $: principle = network.principle;
  $: logo = brainLogos[network.id as keyof typeof brainLogos];
  $: networkLabel = network.why || network.what || network.how;
</script>

<div class="px-4 py-10 flex flex-col items-center gap-6 shadow-md transition-all duration-500 rounded-t-xl h-full justify-center" style="background-color: {principle.color || '#666'}">
  <!-- Logo Container with Solid White Background for better visibility -->
  <div class="w-20 h-20 flex items-center justify-center rounded-2xl bg-white shadow-2xl p-4 transform hover:scale-110 transition-transform duration-300 border border-white/50 shrink-0">
    <img src={logo} alt={t(network.name, currentLang)} class="w-full h-full object-contain" />
  </div>
  
  <div class="text-center flex flex-col items-center">
    {#if principle.preDescription}
      <p class="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-1">
        {t(principle.preDescription, currentLang)}
      </p>
    {/if}
    <h2 class="text-xl font-black text-white leading-tight mb-4 tracking-tight">
      {t(principle.name, currentLang)}
    </h2>

    <!-- Network Name Badge (High Contrast) -->
    <div 
      class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl bg-white text-gray-900 border-none inline-block"
    >
      {t(network.name, currentLang)}
    </div>

    <!-- Network Purpose Text -->
    {#if networkLabel}
      <p class="text-[11px] font-black italic uppercase tracking-widest mt-4 text-white/90">
        {t(networkLabel, currentLang)}
      </p>
    {/if}
  </div>
</div>
