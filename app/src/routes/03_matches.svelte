<script lang="ts">
    import type { Tournament } from '$lib/types/tournament';

    import { calculateMatches, prepareNextRound } from '$lib/calculateMatches';

    interface Props {
        tournament: Tournament;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        }
    let { tournament, updateTournament }: Props = $props();

    function changePlayerPoints(roundId:number, matchId:number, playerId:number, points:number){

        console.log(roundId, matchId, playerId, points)

        if (tournament.matches != null) {
            if (playerId == 1) {
                tournament.matches[roundId][matchId].player1Points = points;
            }else if(playerId == 2){
                tournament.matches[roundId][matchId].player2Points = points;
            }
        }
    }

    function nextRound(){
        if (tournament.matches != null) {
            tournament.round++;
            tournament.matches = prepareNextRound(tournament.matches);
            updateTournament(tournament);    
        }
    }

    if (tournament.status === "initializing") {
        console.log("generating new matches");
        tournament.matches = calculateMatches(tournament.mode, tournament.players);
        updateTournament(tournament, false, false, true);
    }else if (tournament.status === "running"){

    }
</script>
<!-- {JSON.stringify(tournament.matches)} -->
{#if tournament.status === "running"}
    {#each tournament.matches as round, roundIndex }
        {#if round[0].player1?.name != null && round[0].player2?.name != null}
        <div class="round-wrapper">
            <h3 class="round-title">Round {roundIndex + 1}</h3>
            {#each round as match, matchIndex }
            <div class="match-wrapper">
                <h4 class="match-title">Match {match.matchId + 1}</h4>
                <div class="player-wrapper">
                    <div>
                        <div class="player-name">
                            {match.player1?.name}
                        </div>
                        <div>
                            <input 
                                class="player-points" 
                                type="number" 
                                value=0 
                                onchange={(event) => changePlayerPoints(roundIndex, matchIndex, 1 ,Number((event.currentTarget as HTMLInputElement).value))}>
                        </div>
                    </div>

                    <div>vs</div>

                    <div>
                        <div  class="player-name">
                            {match.player2?.name}
                        </div>
                        <div>
                            <input 
                                class="player-points" 
                                type="number" 
                                value=0 
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

    }

    .match-title{
        margin:0.25em 0 0.25em 0.25em;
    }

    .player-wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .player-wrapper div:nth-child(1){
        margin: 0 auto 0 auto;
    }

    .player-wrapper div:nth-child(2){
        /* flex: 1 */
    }

    .player-wrapper div:nth-child(3){
        margin: 0 auto 0 auto;
    }

    .player-name{
        text-align: center;
    }

    .player-points{
        text-align: center;
        width: 3rem;
        margin: 0.5em 0 0.5em 0;
    }

    input[type="text"]{
        background-color: rgba(255,255,255,0.0);
        border-radius: 0.3rem;
        border-style: solid;
        border-width: 2px;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
        padding:0;
        height:25px;
        font-size: 1rem;
    }
</style>