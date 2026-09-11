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
	--light-border: #EDEDED;
	--light-secondary: #ebebeb;
	--light-highlight: #dbdbdb;
	--light-hover: #c1c1c1;
	--light-text: #4c4c4c;
	--light-disabled: #75747a;
	

	--dark: #1c1e22;
	--dark-border: #262A32;
	--dark-secondary: #23272f;
	--dark-highlight: #303541;
	--dark-hover: #404757;
	--dark-text: #cecece;
	--dark-disabled: #75747a;
	
	--scale-green: #26664c;
	--sulfur-yellow: #c1c543;
	--wine-red: #c54361;

	--background: light-dark(var(--light), var(--dark));
  }
</style>
