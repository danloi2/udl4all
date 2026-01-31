<script lang="ts">
  import { getColorStyles } from '../utils/colors';

  export let color: string;
  export let label: string;
  export let small: boolean = false;

  $: styles = getColorStyles(color);
</script>

<span
  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {small ? 'text-xs px-2 py-0.5' : ''}"
  style="{styles.bgLight}; {styles.text}"
>
  {label}
</span>
