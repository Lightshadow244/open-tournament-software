<script lang="ts">
    import { resolve } from '$app/paths';
    import Selection from "./01_selection.svelte";
    let page: number = $state(0);
</script>

<nav class="navbar">
    <a class="home-link" href={resolve("/")}>Open Tournament Software</a>
</nav>

{#if page == 0}
    <Selection />
{/if}

<style>
    .navbar{
        display: flex;
    }
    .home-link{
        
    }
</style>