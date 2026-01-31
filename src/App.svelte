<script lang="ts">
  import Router from 'svelte-spa-router';
  import Home from './routes/Home.svelte';
  import Model from './routes/Model.svelte';
  import Explorer from './routes/Explorer.svelte';
  import Detail from './routes/Detail.svelte';

  const routes = {
    '/': Home,
    '/model': Model,
    '/explore': Explorer,
    '/detail/:id': Detail,
  };
</script>

<Router {routes} />