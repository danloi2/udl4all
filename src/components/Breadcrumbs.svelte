<script lang="ts">
  import { ChevronRight } from 'lucide-svelte';
  import { link } from 'svelte-spa-router';

  export let items: { label: string; href?: string }[] = [];
</script>

<nav class="flex items-center space-x-2 text-sm text-gray-600">
  {#each items as item, i}
    {#if i > 0}
      <ChevronRight class="w-4 h-4" />
    {/if}
    {#if item.href}
      <a href={item.href} use:link class="hover:text-gray-900 transition-colors">
        {item.label}
      </a>
    {:else}
      <span class="text-gray-900 font-medium">{item.label}</span>
    {/if}
  {/each}
</nav>
