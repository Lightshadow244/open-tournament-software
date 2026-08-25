<script lang="ts">
    import type { Tournament } from '$lib/types/tournament';

    import { calculateMatches, prepareNextRound } from '$lib/calculateMatches';

    import CrownIcon from '@iconify-svelte/material-symbols/crown';


    interface Props {
        tournament: Tournament;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        triggerToast(msg:string, level:string): void;
        }
    let { tournament, updateTournament, triggerToast }: Props = $props();

    function changePlayerPoints(roundId:number, matchId:number, playerId:number, points:number){
        if (tournament.matches != null) {
            // add points
            if (playerId == 1) {
                tournament.matches[roundId][matchId].player1Points = points;
            }else if(playerId == 2){
                tournament.matches[roundId][matchId].player2Points = points;
            }

            //change winner
            if (tournament.matches[roundId][matchId].player1Points == tournament.matches[roundId][matchId].player2Points) {
                tournament.matches[roundId][matchId].winner = 0
            }else if (tournament.matches[roundId][matchId].player1Points > tournament.matches[roundId][matchId].player2Points) {
                tournament.matches[roundId][matchId].winner = 1
            }else if (tournament.matches[roundId][matchId].player1Points < tournament.matches[roundId][matchId].player2Points) {
                tournament.matches[roundId][matchId].winner = 2
            }
            updateTournament(tournament); 
        }
    }

    function nextRound(){
        if (tournament.matches != null) {
            let matchesHaveWinner = true;
            tournament.matches.forEach(round => {
                round.forEach(match => {
                    if (match.winner == 0) {
                        matchesHaveWinner = false;
                    }
                })
            });

            if (matchesHaveWinner) {
               tournament.round++;
                tournament.matches = prepareNextRound(tournament.matches);
                updateTournament(tournament);  
            }else{
                triggerToast("There are matches without a winner!", "error");
            }               
        }
    }

    // svelte-ignore state_referenced_locally
    if (tournament.status === "initializing") {
        tournament.matches = calculateMatches(tournament.mode, tournament.players);
        updateTournament(tournament, false, false, true);
    }else if (tournament.status === "running"){
        console.log("running")
    }
</script>
<!-- {JSON.stringify(tournament.matches)} -->
{#if tournament.status === "running"}
    {#each tournament.matches as round, roundIndex (roundIndex)}
        {#if round[0].player1?.name != null && round[0].player2?.name != null}
        <div class="round-wrapper">
            <h3 class="round-title">Round {roundIndex + 1}</h3>
            {#each round as match, matchIndex  (matchIndex)}
            <div class="match-wrapper">
                <h4 class="match-title">Match {match.matchId + 1}</h4>
                <div class="player-wrapper">
                    <div>
                        <div class="player-name">
                            {match.player1?.name}
                        </div>
                        <div class="player-counter">
                            <input 
                                class="player-points" 
                                type="number" 
                                bind:value={match.player1Points}
                                onchange={(event) => changePlayerPoints(roundIndex, matchIndex, 1 ,Number((event.currentTarget as HTMLInputElement).value))}>
                        </div>
                    </div>

                    <div class="vs">
                        vs
                         <div class="test-crown-wrapper {match.winner == 0?"test-crown-wrapper-up":""} {match.winner == 1?"test-crown-wrapper-left":""} {match.winner == 2?"test-crown-wrapper-right":""}">
                            <CrownIcon height="1rem" color="currentcolor"/>
                        </div>
                    </div>

                    <div>
                        <div  class="player-name">
                            {match.player2?.name}
                        </div>
                        <div class="player-counter">
                            <input 
                                class="player-points" 
                                type="number" 
                                bind:value={match.player2Points}
                                onchange={(event) => changePlayerPoints(roundIndex, matchIndex, 2 ,Number((event.currentTarget as HTMLInputElement).value))}>
                        </div>
                    </div>
                </div>
            </div>    
            {/each}
            {#if tournament.round == roundIndex}
                <div>
                    <button class="ots-button ots-button-success" onclick={() => nextRound()}>Next Round</button>
                </div>
            {/if }
            
        </div>
        {/if}
    {/each}
{/if}

<style>
    .round-wrapper{
        display: flex;
        flex-direction: column;
        gap: 20px;
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