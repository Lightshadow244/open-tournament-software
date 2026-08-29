<script lang="ts">
    import type { Tournaments, Tournament } from '$lib/types/tournament';
    
    import { resolve } from '$app/paths';
    import { updateTournaments, loadTournaments} from '$lib/db';

    import SelectionView from "./01_selection.svelte";
    import GeneralView from './02_general.svelte';
    import MatchesView from './03_matches.svelte';
    import OverviewView from './04_overview.svelte';
    import Toast from "./Toast.svelte"

    import SunnyIcon from '@iconify-svelte/material-symbols/sunny';
    import NightIcon from '@iconify-svelte/material-symbols/mode-night';
	import Overview from './04_overview.svelte';

    // let tmpTournaments = ;

    let tts:Tournaments = $state(loadTournaments())

    let tournamentId: string = $state("");
    let view: number = $state(0);
    let mode = $state("dark");
    let content_wrapper: HTMLDivElement;
    let navbar: HTMLElement;
    let toastContent = $state("");
    let toastLevel = $state("");

    function updateTournament(tt:Tournament, configuring=false, initializing=false, running=false){
        if(configuring){
            tt.status = "configuring";
            tt.roundsAndMatches = [];
            tt.round = 0;
            tt.ranks = []
        }else if(initializing){
            tt.status = "initializing";
        }else if(running){
            tt.status = "running";
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
            players              : [{id: 0, name:"Player 1", icon: "empty"},{id: 1, name:"Player 2", icon: "empty"},{id: 2, name:"Player 3", icon: "empty"},{id: 3, name:"Player 4", icon: "empty"}],
            roundsAndMatches     : [],
            round                : 0,
            ranks               : []
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



      function triggerToast(msg:string, level="warning"){
        toastContent = msg;
        toastLevel = level;
    }

    function hideToast(){
        toastLevel = "";
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
             <NightIcon height="1rem" color="currentcolor"/>
        {:else if  mode === "light"}
             <SunnyIcon height="1rem" color="currentcolor"/>
        {/if}
        
    </button>
</nav>

<div bind:this={content_wrapper} class="content-wrapper">
    <div class="content">
        {#if view == 0}
            <SelectionView tournaments={$state.snapshot(tts)} createNewTournament={createNewTournament} selectTournament={selectTournament}/>
        {:else if view == 1}
            <GeneralView tournament={$state.snapshot(tts[tournamentId])} triggerToast={triggerToast} deleteTournament={deleteTournament} updateTournament={updateTournament} />
        {:else if view == 2}
            <MatchesView tournament={$state.snapshot(tts[tournamentId])} triggerToast={triggerToast} updateTournament={updateTournament}/>
        {:else if view == 3}
            <OverviewView tournament={$state.snapshot(tts[tournamentId])} triggerToast={triggerToast} updateTournament={updateTournament}/>
        {/if}
    </div>
    <Toast toastContent={toastContent} toastLevel={toastLevel}  hideToast={hideToast}/>
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
        transition: all 0.3s ease;
        z-index: 999;
        
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
    /* .home-link{
    }
    .nav-item{
    } */
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
        padding-bottom: 5rem;
        color-scheme: dark;
        font-family: Open-Sans,sans-serif;
        font-size: 1rem;
        transition: all 0.3s ease;
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
        transition: all 0.3s ease;
        
        
    }

    :global(.ots-button-success){
        background-color: var(--scale-green);
        color: var(--dark-text);
    }

    :global(.ots-button-danger){
        background-color: var(--wine-red);
        color: var(--dark-text);
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
        transition: border-color 0.3s ease;
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