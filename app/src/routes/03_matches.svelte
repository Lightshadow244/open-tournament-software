<script lang="ts">
    import type { Tournament, Player } from '$lib/types/tournament';

    import { fade } from 'svelte/transition';
    import { calculateMatches, calculateRanks } from '$lib/calculateMatches';

    import Podium from "./Podium.svelte"

    import CrownIcon from '@iconify-svelte/material-symbols/crown';


    interface Props {
        tournament: Tournament;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        triggerToast(msg:string, level:string): void;
        }
    let { tournament, updateTournament, triggerToast }: Props = $props();

    function changePlayerPoints(roundId:number, matchId:number, playerId:number, points:number){
        if (tournament.roundsAndMatches != null) {
            // add points
            if (playerId == 1) {
                tournament.roundsAndMatches[roundId][matchId].player1Points = points;
            }else if(playerId == 2){
                tournament.roundsAndMatches[roundId][matchId].player2Points = points;
            }

            //change winner
            if (tournament.roundsAndMatches[roundId][matchId].player1Points == tournament.roundsAndMatches[roundId][matchId].player2Points) {
                tournament.roundsAndMatches[roundId][matchId].winner = null;
                tournament.roundsAndMatches[roundId][matchId].loser = null
                tournament.roundsAndMatches[roundId][matchId].winnerId = 0;
            }else if (tournament.roundsAndMatches[roundId][matchId].player1Points > tournament.roundsAndMatches[roundId][matchId].player2Points) {
                tournament.roundsAndMatches[roundId][matchId].winner = tournament.roundsAndMatches[roundId][matchId].player1
                tournament.roundsAndMatches[roundId][matchId].loser = tournament.roundsAndMatches[roundId][matchId].player2
                tournament.roundsAndMatches[roundId][matchId].winnerId = 1;
            }else if (tournament.roundsAndMatches[roundId][matchId].player1Points < tournament.roundsAndMatches[roundId][matchId].player2Points) {
                tournament.roundsAndMatches[roundId][matchId].winner = tournament.roundsAndMatches[roundId][matchId].player2
                tournament.roundsAndMatches[roundId][matchId].loser = tournament.roundsAndMatches[roundId][matchId].player1
                tournament.roundsAndMatches[roundId][matchId].winnerId = 2;
            }
            updateTournament(tournament); 
        }
    }

    function nextRound(){
        if (tournament.roundsAndMatches != null) {
            let roundsAndMatchesHaveWinner = true;
            tournament.roundsAndMatches.forEach(round => {
                round.forEach(match => {
                    if (match.winner == null) {
                        roundsAndMatchesHaveWinner = false;
                    }
                })
            });

            if (roundsAndMatchesHaveWinner) {
                
                tournament.round++;
                tournament.roundsAndMatches = calculateMatches(tournament.mode, tournament.players, tournament.roundsAndMatches);
                
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

    // svelte-ignore state_referenced_locally
    if (tournament.status === "initializing") {
        tournament.roundsAndMatches = calculateMatches(tournament.mode, tournament.players, tournament.roundsAndMatches);
        updateTournament(tournament, false, false, true);
    }else if (tournament.status === "running"){
        console.log("running")
        console.log(tournament)
    }
</script>
{#if tournament.status === "running"}
    {#each tournament.roundsAndMatches as round, roundIndex (roundIndex)}
        {#if round[0].player1?.name != null && round[0].player2?.name != null}
        <div class="round-wrapper" transition:fade>
            
            {#if round[0].final}
                <h3 class="round-title">Final</h3>
            {:else if round[0].semiFinal}
                <h3 class="round-title">Semi-Final</h3>
            {:else}
                <h3 class="round-title">Round {roundIndex + 1}</h3>
            {/if}

            {#each round as match, matchIndex  (matchIndex)}
            <div class="match-wrapper">

                <h4 class="match-title">{match.name}</h4>

                <div class="player-wrapper">
                    <div>
                        <div class="player-name">
                            {match.player1?.name}
                        </div>
                        <div class="player-counter">
                            <!-- svelte-ignore binding_property_non_reactive -->
                            <input 
                                class="player-points" 
                                type="number" 
                                bind:value={match.player1Points}
                                onchange={(event) => changePlayerPoints(roundIndex, matchIndex, 1 ,Number((event.currentTarget as HTMLInputElement).value))} disabled={tournament.round == roundIndex ? false : true}>
                        </div>
                    </div>

                    <div class="vs">
                        vs
                         <div class="test-crown-wrapper {match.winner == null?"test-crown-wrapper-up":""} {match.winnerId == 1?"test-crown-wrapper-left":""} {match.winnerId == 2?"test-crown-wrapper-right":""}">
                            <CrownIcon height="1rem" color="currentcolor"/>
                        </div>
                    </div>

                    <div>
                        <div  class="player-name">
                            {match.player2?.name}
                        </div>
                        <div class="player-counter">
                            <!-- svelte-ignore binding_property_non_reactive -->
                            <input 
                                class="player-points" 
                                type="number" 
                                bind:value={match.player2Points}
                                onchange={(event) => changePlayerPoints(roundIndex, matchIndex, 2 ,Number((event.currentTarget as HTMLInputElement).value))} disabled={tournament.round == roundIndex ? false : true}>
                        </div>
                    </div>
                </div>
            </div>    
            {/each}
            {#if tournament.round == roundIndex && tournament.roundsAndMatches[tournament.roundsAndMatches.length - 1][0].nextMatchId != -1}
                <div>
                    <button class="ots-button ots-button-success" onclick={() => nextRound()}>Next Round</button>
                </div>
            {/if }
            
        </div>
        {/if}
    {/each}
    {#if tournament.roundsAndMatches[tournament.roundsAndMatches.length - 1][0].final && tournament.ranks.length == 0}
        <div>
            <button class="ots-button ots-button-success" onclick={() => finish()}>Finish</button>
        </div>
    {:else if tournament.ranks.length != 0}
        <div transition:fade>
            <Podium tournament={tournament}/>
        </div>
    {/if }
{/if}

<style>
    .round-wrapper{
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 3rem;
    }
    .round-title{
        margin: 0;
    }
    .match-wrapper{
        
        background-color: rgba(255,255,255,0.0);
        border-radius: 0.3rem;
        border-style: solid;
        border-width: 2px;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
        transition: all 0.3s ease;

    }

    .match-title{
        margin:0.25em 0 0.25em 0.25em;
    }

    .player-wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .player-wrapper > div:nth-child(1){
        margin: 0 auto 0 auto;
        position:relative;
    }

    .player-counter{
        display:flex;
    }

    .player-wrapper > div:nth-child(3){
        margin: 0 auto 0 auto;
        position:relative;
    }

    .player-name{
        text-align: center;
    }

    .player-points{
        text-align: center;
        width: 3rem;
        margin: 0.5em auto 0.5em auto;
    }

    input[type="number"]{
        background-color: rgba(255,255,255,0.0);
        border-radius: 0.3rem;
        border-style: solid;
        border-width: 2px;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
        padding:0;
        height:25px;
        font-size: 1rem;
        color: light-dark(var(--light-text), var(--dark-text));
        transition: all 0.3s ease;
        
    }

    .vs{
        position: relative;
    }

    .test-crown-wrapper{
        position: absolute;
        /* transition: all 0.3s ease; */
    }

    .test-crown-wrapper-up{
        top: -1rem;
    }

    .test-crown-wrapper-left{
        left: -1rem;
        top:0;
    }

    .test-crown-wrapper-right{
        right: -1rem;
        top:0;
    }
</style>