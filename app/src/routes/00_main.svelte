<script lang="ts">
    import { resolve } from '$app/paths';
    import Selection from "./01_selection.svelte";

    import SunnyIcon from '@iconify-svelte/material-symbols/sunny';
    import NightIcon from '@iconify-svelte/material-symbols/mode-night';


    let page: number = $state(0);
    let mode = $state("dark")
    let content_wrapper: HTMLDivElement;
    let navbar: HTMLElement;

    function switchMode(tmpMode:string) {
        mode = tmpMode === "dark" ? "light" : "dark";
        content_wrapper.style.setProperty("color-scheme", mode);
        navbar.style.setProperty("color-scheme", mode);
        
    }
</script>

<nav bind:this={navbar} class="navbar">

    <a class="nav-item nav-start home-link" href={resolve("/")}>Open Tournament Software</a>
    <span>Dies ist ein Text</span>
    

    <button class="nav-item nav-auto nav-end ots-button" onclick={() => {switchMode(mode)}}>
        {#if mode === "dark"}
            <!-- <span class="material-icons ots-icon">mode_night</span>  -->
             <NightIcon height="1rem" color="currentcolor"/>
        {:else if  mode === "light"}
            <!-- <span class="material-icons ots-icon">wb_sunny</span>  -->
             <SunnyIcon height="1rem" color="currentcolor"/>
        {/if}
        
    </button>
</nav>

<div bind:this={content_wrapper} class="content-wrapper">
    <div class="content">
        {#if page == 0}
            <Selection />
        {/if}
    </div>
    
</div>


<style>
    .navbar{
        display: flex;
        background-color: light-dark(var(--light), var(--dark-secondary));
        color: light-dark(var(--light-text), var(--dark-text));
        height: 4rem;
        position: fixed;
        top: 0;
        width: 100%;
        align-items: center;
        color-scheme: dark;
        font-family: Open-Sans,sans-serif;
    }
    .navbar::after{
        content:"";
        background: linear-gradient(#0000000d,#0000);
        top: auto;
        bottom: -4px;
        width: 100%;
        height: 4px;
        position: absolute;
    }
    .home-link{
        
    }
    .nav-item{
    }
    .nav-start{
        margin-left: 3rem;
    }
    .nav-end{
        margin-right: 3rem;
    }
    .nav-auto{
        margin-left:auto;
    }

    .content-wrapper{
        background-color: light-dark(var(--light), var(--dark));
        color: light-dark(var(--light-text), var(--dark-text));
        width: 100%;
        min-height: 100vh;
        padding-top: 5rem;
        color-scheme: dark;
        font-family: Open-Sans,sans-serif;
    }
    .content{
        width: 1500px;
        margin: 0 auto 0 auto;
    }

    :global(.ots-button){
        /* background-color: light-dark(var(--light), var(--dark)); */
        background-color: rgba(255,255,255,0.0);
        border-radius: 0.3rem;
        border-style: solid;
        border-width: 1px 2px 2px 1px;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
        padding: 5px 5px 5px 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: light-dark(var(--light-text), var(--dark-text));
        
        
    }

    :global(.ots-button:active){
        border-width: 2px 1px 1px 2px;
    }

    :global(.ots-button:hover){
        border-color: light-dark(var(--light-hover), var(--dark-hover));
    }

    :global(.ots-icon){
        font-size: 1rem;
        color:currentColor;
        
    }

    @media (width <= 1600px) {
        .content{width: 1000px;}
    }

    @media (width <= 1280px) {
        .content{width: 750px;}
    }

    @media (width <= 768px) {
        .content{width: 500px;}
    }

    @media (width <= 500px) {
        .content{width: 100%;}
    }
</style>