<script lang="ts">
    import { resolve } from '$app/paths';
    import type { Tournaments, Tournament } from '$lib/types/tournament';

    import SelectionView from "./01_selection.svelte";
    import TournamentView from './02_tournament.svelte';

    import SunnyIcon from '@iconify-svelte/material-symbols/sunny';
    import NightIcon from '@iconify-svelte/material-symbols/mode-night';

    let tmpTournaments = {};

    if (typeof localStorage !== 'undefined'){
        if (localStorage.getItem("tournaments") != null) {
            tmpTournaments =  JSON.parse(localStorage.getItem("tournaments") as string);
        }  
    }

    let tts:Tournaments = $state(tmpTournaments)

    let tournamentId: string = $state("");
    let mode = $state("dark");
    let content_wrapper: HTMLDivElement;
    let navbar: HTMLElement;

    function updateTournament(tt:Tournament){
        tts[tt.id] = tt
        updateLocalStorage();
    }

    function createNewTournament(){
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric"
            
            };
        let dateString = date.toLocaleDateString("de-DE", options);
        let new_tt: Tournament = {
            id                   : crypto.randomUUID(),
            title                : "New Tournament",
            mode                 : "Single Elimination",
            participantCount     : 0,
            date                 : dateString,
            modified             : dateString,
            location             : ""
        }

        tts[new_tt.id] = new_tt;
        tournamentId = new_tt.id;
        updateLocalStorage();
    }

    function deleteTournament(id:string){
        delete tts[id];
        tournamentId = "";
        updateLocalStorage();
    }

    function updateLocalStorage(){
        if (typeof localStorage !== 'undefined'){
            localStorage.setItem("tournaments", JSON.stringify($state.snapshot(tts)))
            
        }
    }

    function selectTournament(id:string){
        tournamentId = id;
    }

    function switchMode(tmpMode:string) {
        mode = tmpMode === "dark" ? "light" : "dark";
        content_wrapper.style.setProperty("color-scheme", mode);
        navbar.style.setProperty("color-scheme", mode);
        
    }
</script>

<nav bind:this={navbar} class="navbar">

    <a class="nav-item nav-start home-link" href={resolve("/")}>Open Tournament Software</a>
    
    <button class="nav-item">Tournaments</button>
    {#if tournamentId != ""}
        <button class="nav-item">Settings</button>
        <button class="nav-item">Matches</button>
        <button class="nav-item">Overview</button>
    {/if}
    

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
        {#if tournamentId == ""}
            <SelectionView tournaments={$state.snapshot(tts)} createNewTournament={createNewTournament} selectTournament={selectTournament}/>
        {:else}
            <TournamentView tournament={$state.snapshot(tts[tournamentId])} deleteTournament={deleteTournament} updateTournament={updateTournament}/>
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
        margin-right: 0.25rem;
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