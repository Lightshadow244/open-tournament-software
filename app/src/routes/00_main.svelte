<script lang="ts">
    import type { Tournaments, Tournament } from '$lib/types/tournament';
    
    import { resolve } from '$app/paths';
    import { updateTournaments, loadTournaments} from '$lib/db';
    import SelectionView from "./01_selection.svelte";
    import GeneralView from './02_general.svelte';
    import MatchesView from './03_matches.svelte';

    import SunnyIcon from '@iconify-svelte/material-symbols/sunny';
    import NightIcon from '@iconify-svelte/material-symbols/mode-night';

    // let tmpTournaments = ;

    let tts:Tournaments = $state(loadTournaments())

    let tournamentId: string = $state("");
    let view: number = $state(0);
    let mode = $state("dark");
    let content_wrapper: HTMLDivElement;
    let navbar: HTMLElement;

    function updateTournament(tt:Tournament, configuring=false, initializing=false, running=false){
        if(configuring){
            tt.status = "configuring"
        }else if(initializing){
            tt.status = "initializing"
        }else if(running){
            tt.status = "running"
        }

        tts[tt.id] = tt
        updateTournaments($state.snapshot(tts));
    }

    function createNewTournament(){
        const date = new Date();
        let dateString = date.toISOString();
        let new_tt: Tournament = {
            id                   : crypto.randomUUID(),
            status               : "configuring",
            title                : "New Tournament",
            mode                 : "Single Elimination",
            date                 : dateString.split("T")[0],
            time                 : dateString.split("T")[1].split("Z")[0].substring(0, 5),
            modified             : dateString,
            location             : "",
            players              : [{name:"Player 1", icon: "empty"},{name:"Player 2", icon: "empty"},{name:"Player 3", icon: "empty"}],
            matches              : null,
            round                : 0
        }

        tts[new_tt.id] = new_tt;
        tournamentId = new_tt.id;
        view = 1;
        
        updateTournaments($state.snapshot(tts));
    }

    function deleteTournament(id:string){
        delete tts[id];
        tournamentId = "";
        view = 0;

        
        updateTournaments($state.snapshot(tts));
    }

    function selectTournament(id:string){
        tournamentId = id;
        view = 1;
    }

    function addPlayerToTournament(tt:Tournament){
        tt.players?.push({name:"Player " + (tt.players.length + 1), icon: "empty"})
        tts[tt.id] = tt
    }

    function removePlayerFromTournament(tt:Tournament, playerId:number){
        if (tt.players.length > 0) {
            tt.players.splice(playerId, 1);
            tts[tt.id] = tt
        }
    }

    function switchMode(tmpMode:string) {
        mode = tmpMode === "dark" ? "light" : "dark";
        content_wrapper.style.setProperty("color-scheme", mode);
        navbar.style.setProperty("color-scheme", mode);
        
    }
</script>

<nav bind:this={navbar} class="navbar">

    <a class="nav-item nav-start home-link" href={resolve("/")}>Open Tournament Software</a>
    
    <div class="view-selection nav-item">
        <button class="{view == 0 ? "active":""}" onclick={() => {view=0}}>Tournaments</button>
        {#if tournamentId != ""}
            <button class="{view == 1 ? "active":""}" onclick={() => {view=1}}>General</button>
            <button class="{view == 2 ? "active":""}" onclick={() => {view=2}}>Matches</button>
            <button class="{view == 3 ? "active":""}" onclick={() => {view=3}}>Overview</button>
        {/if}

    </div>
    
    

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
        {#if view == 0}
            <SelectionView tournaments={$state.snapshot(tts)} createNewTournament={createNewTournament} selectTournament={selectTournament}/>
        {:else if view == 1}
            <GeneralView tournament={$state.snapshot(tts[tournamentId])} deleteTournament={deleteTournament} updateTournament={updateTournament} addPlayerToTournament={addPlayerToTournament} removePlayerFromTournament={removePlayerFromTournament}/>
        {:else if view == 2}
            <MatchesView tournament={$state.snapshot(tts[tournamentId])} updateTournament={updateTournament}/>
        {:else if view == 3}
            Overview
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
        gap: 0.25rem;
        transition: background-color 0.3s ease, color 0.3s ease;
        
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

    .view-selection{
        display: flex;
        gap:0;
        height:100%
    }

    .view-selection button{
        background-color: rgba(255,255,255,0.0);
        border-width: 0 0 1px 0;
        border-color: rgba(255,255,255,0.0);
        font-size: 1rem;
    }

    .view-selection button:hover{
        border-color: rgba(255,255,255,1);
        cursor: pointer;
    }

    .view-selection .active{
        color: var(--scale-green);
        border-color: var(--scale-green);
        border-width: 0 0 2px 0;
    }

    .view-selection .active:hover{
        border-color: var(--scale-green);
    }

    .content-wrapper{
        background-color: light-dark(var(--light), var(--dark));
        color: light-dark(var(--light-text), var(--dark-text));
        width: 100%;
        min-height: 100vh;
        padding-top: 5rem;
        color-scheme: dark;
        font-family: Open-Sans,sans-serif;
        font-size: 1rem;
        transition: background-color 0.3s ease, color 0.3s ease;
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
        transition: color 0.3s ease, color 0.3s ease;
        transition: border-color 0.3s ease, color 0.3s ease;
        
        
    }

    :global(.ots-button-success){
        background-color: var(--scale-green);
    }

    :global(.ots-button-danger){
        background-color: var(--wine-red);
    }

    :global(.ots-button-warning){
        background-color: var(--sulfur-yellow);
        color: var(--light-text)
    }

    :global(.ots-button:active){
        border-width: 2px 1px 1px 2px;
    }

    :global(.ots-button:hover){
        border-color: light-dark(var(--light-hover), var(--dark-hover));
        transition: border-color 0.3s ease, color 0.3s ease;
        cursor: pointer;
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