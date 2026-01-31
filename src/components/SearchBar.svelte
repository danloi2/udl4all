<script lang="ts">
  import { Search, X } from 'lucide-svelte';
  import { searchQuery } from '../stores/search';

  let query = '';
  
  searchQuery.subscribe((value) => {
    query = value;
  });

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    searchQuery.set(target.value);
  }

  function clearSearch() {
    searchQuery.set('');
  }
</script>

<div class="relative w-full max-w-2xl">
  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
    <Search class="w-5 h-5" />
  </div>
  <input
    type="text"
    value={query}
    on:input={handleInput}
    placeholder="Buscar por código, nombre o descripción..."
    class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
  {#if query}
    <button
      on:click={clearSearch}
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      <X class="w-5 h-5" />
    </button>
  {/if}
</div>
