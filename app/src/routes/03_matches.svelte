<script lang="ts">
    import type { Tournament, Player } from '$lib/types/tournament';
    import {changePlayerPointsForMatch} from '$lib/types/tournament';

    import { fade } from 'svelte/transition';
    import { fillNextRound, calculateRanks } from '$lib/calculateMatches';

    import PlayerIcon from './PlayerIcon.svelte';
    import Podium from "./Podium.svelte"

    import CrownIcon from '@iconify-svelte/material-symbols/crown';

    interface Props {
        tournament: Tournament;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        triggerToast(msg:string, level:string): void;
        }
    let { tournament, updateTournament, triggerToast }: Props = $props();

    function nextRound(){
        if (tournament.roundsAndMatches != null) {
            let roundsAndMatchesHaveWinner = true;
            tournament.roundsAndMatches[tournament.round].forEach(match => {
                if (match.winner == null && match.player1?.name !== "filler" && match.player2?.name !== "filler") {
                    roundsAndMatchesHaveWinner = false;
                }
            });

            if (roundsAndMatchesHaveWinner) {
                tournament.roundsAndMatches = fillNextRound(tournament);
                tournament.round++;
                updateTournament(tournament);
            }else{
                triggerToast("There are roundsAndMatches without a winner!", "error");
            } 
        }
    }

    function finish(){
        let roundsAndMatchesHaveWinner = true;
        // console.log(tournament.roundsAndMatches);
        tournament.roundsAndMatches[tournament.roundsAndMatches.length - 1].forEach(match => {
            if (match.winner == null && match.player1?.name !== "filler" && match.player2?.name !== "filler") {
                    roundsAndMatchesHaveWinner = false;
                }
        })

        if (roundsAndMatchesHaveWinner) {
                tournament.ranks = calculateRanks(tournament);
                updateTournament(tournament);
        }else{
            triggerToast("There are roundsAndMatches without a winner!", "error");
        } 
        
    }

    	$effect(() => {
            if (tournament.ranks.length == 0){
                location.hash = "#" + "round-" + tournament.round;
            }else{
                location.hash = "#" + "podium";
            }
        })
</script>

{#if tournament.status === "running"}
    {#each tournament.roundsAndMatches as round, roundId (roundId)}
        {#if roundId <= tournament.round}
            <div class="round-wrapper" id="round-{roundId}" transition:fade>
                
                {#if round[0].final}
                    <h3 class="round-title">Final</h3>
                {:else if round[0].semiFinal}
                    <h3 class="round-title">Semi-Final</h3>
                {:else}
                    <h3 class="round-title">Round: {roundId + 1}</h3>
                {/if}

                <!-- list matches without a filler player -->
                {#each round as match, matchId  (matchId)}
                    {#if match.player1?.name !== "filler" && match.player2?.name !== "filler"}
                        <div class="match-wrapper">

                            {#if match.final}
                                <h4 class="match-title">Final</h4>
                            {:else if match.littleFinal}
                                <h4 class="match-title">3rd-Place</h4>
                            {:else}
                                <h4 class="match-title">Match: {matchId + 1}</h4>
                            {/if}

                            <div class="player-wrapper">
                                <div>
                                    <div class="player-info">
                                        <!-- <div class="player-name">
                                            {match.player1?.name}
                                        </div> -->
                                        <PlayerIcon player={<Player>match.player1}/>
                                    </div>
                                    
                                    <div class="player-counter">
                                        <!-- svelte-ignore binding_property_non_reactive -->
                                        <input 
                                            class="player-points" 
                                            type="{tournament.round == roundId && tournament.ranks.length == 0 ? "number" : "text"}" 
                                            bind:value={match.player1Points}
                                            onchange={(event) => {updateTournament(changePlayerPointsForMatch(tournament, roundId, matchId, 1 ,Number((event.currentTarget as HTMLInputElement).value)))}} 
                                            disabled={tournament.round == roundId && tournament.ranks.length == 0 ? false : true}>
                                    </div>
                                </div>

                                <div class="vs">
                                    vs
                                    <div class="test-crown-wrapper {match.winner == null?"test-crown-wrapper-up":""} {match.winnerId == 1?"test-crown-wrapper-left":""} {match.winnerId == 2?"test-crown-wrapper-right":""}">
                                        <CrownIcon height="1rem" color="currentcolor"/>
                                    </div>
                                </div>

                                <div>
                                    <div class="player-info">
                                        <!-- <div class="player-name">
                                            {match.player2?.name}
                                        </div> -->
                                        <PlayerIcon player={<Player>match.player2}/>
                                    </div>
                                    <div class="player-counter">
                                        <!-- svelte-ignore binding_property_non_reactive -->
                                        <input 
                                            class="player-points" 
                                            type="{tournament.round == roundId && tournament.ranks.length == 0 ? "number" : "text"}" 
                                            bind:value={match.player2Points}
                                            onchange={(event) => {updateTournament(changePlayerPointsForMatch(tournament, roundId, matchId, 2 ,Number((event.currentTarget as HTMLInputElement).value)))}} 
                                            disabled={tournament.round == roundId && tournament.ranks.length == 0 ? false : true}>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    {/if} 
                {/each}
                
                <!-- at the end list matches with a filler player -->
                {#each round as match, matchId  (matchId)}
                    {#if match.player1?.name === "filler" || match.player2?.name === "filler"}
                        <div class="idle-wrapper">
                            <div class="match-wrapper ">
                                <h4 class="idle-title">Idle</h4>
                                <div class="idle-player">
                                    {match.player1?.name === "filler"?match.player2?.name:match.player1?.name}
                                </div>
                            </div>
                        </div>
                    {/if}
                {/each}
                <!-- {#if tournament.round == roundId && tournament.roundsAndMatches[tournament.roundsAndMatches.length - 1][0].nextMatchId != -1} -->
                {#if tournament.round == roundId && tournament.round != tournament.roundsAndMatches.length - 1}
                    <div>
                        <button class="ots-button ots-button-success" onclick={() => nextRound()}>Next Round</button>
                    </div>
                {/if }
                
            </div>
        {/if}
    {/each}
    {#if tournament.round == tournament.roundsAndMatches.length - 1 && tournament.ranks.length == 0}
        <div>
            <button class="ots-button ots-button-success" onclick={() => finish()}>Finish</button>
        </div>
    {:else if tournament.ranks.length != 0}
        <div id="podium" transition:fade>
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
        scroll-margin-top: 4rem;
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

    .idle-wrapper{
        display: flex;
    }
    .idle-wrapper .match-wrapper{
        margin: 0 auto 0 auto;
    }

    .idle-title{
        margin: 1rem 3rem 1rem 3rem;
        text-align: center;
    }

    .idle-player{
        margin: 0 3rem 1rem 3rem;
        text-align: center;
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
    .player-info{
        display:flex;
        align-items: center;
    }

    .player-name{
        text-align: center;
        margin-right: 5px;
    }

    .player-points{
        text-align: center;
        width: 3rem;
        margin: 0.5em auto 0.5em auto;
    }

    input[type="number"], input[type="text"]{
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