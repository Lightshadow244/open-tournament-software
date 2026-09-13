<script lang="ts">
    import type { Tournament} from '$lib/types/tournament';

    import { fillNextRound, calculateRanks } from '$lib/calculateMatches';

    import OverviewSE from './04a_overview_SE.svelte';

    interface Props {
        tournament: Tournament;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        triggerToast(msg:string, level:string): void;
        }
    let { tournament, updateTournament, triggerToast }: Props = $props();

    let offsetX = $state(50);
    let offsetY = $state(50);
    let scale = $state(1);

    let area: HTMLDivElement;

    function startMovement(){
        area.addEventListener("mousemove", moveImage);
        area.addEventListener("mouseup", stopMovement);
        area.addEventListener("mouseleave", stopMovement);
    }

    function stopMovement(){
        area.removeEventListener("mousemove", moveImage);
        area.removeEventListener("mouseup", stopMovement)
        area.removeEventListener("mouseleave", stopMovement)
    }

    function moveImage(event: MouseEvent){
        event.preventDefault();
        offsetX += event.movementX;
        offsetY += event.movementY;
    }

    function zoom(event : WheelEvent) {
        event.preventDefault();

        scale += event.deltaY * -0.001;

        // Restrict scale
        scale = Math.min(Math.max(0.125, scale), 4);
    }

    function nextRound(){
        if (tournament.roundsAndMatches != null) {
            let roundsAndMatchesHaveWinner = true;
            tournament.roundsAndMatches[tournament.round].forEach(match => {
                if (match.winner == null) {
                    roundsAndMatchesHaveWinner = false;
                }
            });

            if (roundsAndMatchesHaveWinner) {
                tournament.roundsAndMatches = fillNextRound(tournament);
                tournament.round++;
                console.log(tournament)
                updateTournament(tournament);
            }else{
                triggerToast("There are roundsAndMatches without a winner!", "error");
            } 
        }
    }

    function finish(){

        let lastMatch = tournament.roundsAndMatches[tournament.roundsAndMatches.length - 1][0];

        if (lastMatch.winner != null) {
            tournament.ranks = calculateRanks(tournament);
            updateTournament(tournament);
        }else{
            triggerToast("There are roundsAndMatches without a winner!", "error");
        }
        
    }
    
</script>
<div>
    {#if tournament.round != tournament.roundsAndMatches.length - 1}
        <div>
            <button class="ots-button ots-button-success" onclick={() => nextRound()}>Next Round</button>
        </div>
    {:else if tournament.round == tournament.roundsAndMatches.length - 1 && tournament.ranks.length == 0}
        <div>
            <button class="ots-button ots-button-success" onclick={() => finish()}>Finish</button>
        </div>
    {/if }

    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div bind:this={area} class="overview-area" onmousedown={() => startMovement()} onwheel={(event) => zoom(event)} role="application" aria-label="tournament-overview-wrapper">
        <div class="overview-wrapper" style="left: {offsetX}px; top: {offsetY}px; transform:scale({scale});">
            {#if tournament.mode === "Single Elimination"}
                <OverviewSE tournament={tournament} updateTournament={updateTournament} triggerToast={triggerToast}/>
            {/if}
        </div>
    </div>
</div>

<style>
    /* .overview-area{
        position: relative;
        width: 100%;
        height: calc(100vh - 4rem);
        overflow: hidden;
        background-color: light-dark(var(--light), var(--dark-secondary));
        border-radius: 0.3rem;
    } */
    .overview-area{
        margin-top: 0.5rem;
        border-radius: 0.3rem;
        border-style: solid;
        border-width: 1px 2px 2px 1px;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
        transition: border-color 0.3s ease;
        overflow: hidden;
        position: relative;
        width: 100%;
        height: calc(100vh - 6rem);
    }
    .overview-wrapper{
        position: absolute;
    }
</style>
