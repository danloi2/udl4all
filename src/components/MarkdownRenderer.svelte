<script lang="ts">
  import { Markdown } from 'svelte-exmarkdown';

  export let content: string;
</script>

<div class="prose prose-sm max-w-none">
  <Markdown md={content} />
</div>

<style>
  :global(.prose) {
    color: inherit;
  }
  :global(.prose p) {
    margin-bottom: 0.5em;
  }
  :global(.prose ul) {
    margin-top: 0.5em;
  }
</style>
