<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
  :root {
    

  	--light: #ffffff;
	--light-secondary: #ebebeb;
	--light-highlight: #dbdbdb;
	--light-hover: #c1c1c1;
	--light-text: #4c4c4c;

	--dark: #1c1e22;
	--dark-secondary: #23272f;
	--dark-highlight: #303541;
	--dark-hover: #404757;
	--dark-text: #cecece;
	
	--scale-green: #26664c;

	--background: light-dark(var(--light), var(--dark));
  }
</style>
