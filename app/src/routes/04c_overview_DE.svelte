<script lang="ts">
    import type { Tournament, Player, Match} from '$lib/types/tournament';
    import {changePlayerPointsForMatch, calculateFillBlocks} from '$lib/types/tournament';

    import OverviewMatch from './OverviewMatch.svelte';


    interface Props {
        tournament: Tournament;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        triggerToast(msg:string, level:string): void;
        }
    let { tournament, updateTournament, triggerToast }: Props = $props();
    

    let overview = {
        "winningBracket": [] as number[][],
        "losingBracket": [] as number[][]
    }


    function buildOverview(){
        let wb = overview.winningBracket;
        let wbRoundCounter = 0;
        tournament.roundsAndMatches.forEach((round, roundId) => {
            wb.push([]);
            
            // placeholder before matches
            for (let index = 0; index < calculateFillBlocks(wbRoundCounter); index++) {
                wb[roundId].push(-1)
            }

            // matches
            // first round and last round
            if(roundId == 0 || roundId + 1 == tournament.roundsAndMatches.length){
                round.forEach((match, matchId) => {
                    // wb[roundId].push(match)
                    wb[roundId].push(match.matchId)

                    // placeholder between matches
                    if (matchId + 1 != round.length) {
                        for (let index = 0; index < calculateFillBlocks(wbRoundCounter + 1); index++) {
                            wb[roundId].push(-1)
                        }
                    }
                })
                wbRoundCounter++
            }else{
                if(round[0].winningBracket){
                    round.slice(0, round.length / 2).forEach((match, matchId) => {
                        wb[roundId].push(match.matchId)

                        // placeholder between matches
                        if (matchId + 1 != round.length / 2) {
                            for (let index = 0; index < calculateFillBlocks(wbRoundCounter + 1); index++) {
                                wb[roundId].push(-1)
                            }
                        }
                    })
                    wbRoundCounter++
                }
            }
        })

        let lb = overview.losingBracket;
        let lbRoundCounter = 0;
        tournament.roundsAndMatches.forEach((round, roundId) => {
            lb.push([]);

            if (roundId == 0 || roundId + 1 == tournament.roundsAndMatches.length) {
                lb[roundId].push(-1)
                lbRoundCounter++;
            }else{
                // placeholder before matches
                for (let index = 0; index < calculateFillBlocks(lbRoundCounter); index++) {
                    lb[roundId].push(-1)
                }

                if(round[0].winningBracket){
                    round.slice(round.length / 2, round.length ).forEach((match, matchId) => {
                        lb[roundId].push(match.matchId)

                        // placeholder between matches
                        if (matchId + 1 != round.length / 2) {
                            for (let index = 0; index < calculateFillBlocks(lbRoundCounter + 1); index++) {
                                lb[roundId].push(-1)
                            }
                        }
                    })
                }else{
                    round.forEach((match, matchId) => {
                        lb[roundId].push(match.matchId)

                        // placeholder between matches
                        if (matchId + 1 != round.length) {
                            for (let index = 0; index < calculateFillBlocks(lbRoundCounter + 1); index++) {
                                lb[roundId].push(-1)
                            }
                        }
                    })
                    lbRoundCounter++
                }
            }
        })
    }

    buildOverview();
</script>

<div>
    <div>
        <div>
            Winning Bracket
        </div>

        <div class="rounds-wrapper">
            {#each tournament.roundsAndMatches as round, roundId (roundId) }
                <div class="matches-wrapper">
                    {#each overview.winningBracket[roundId] as matchId, i (i) }
                        {#if matchId == -1}
                            <div class="placeholder" ></div>
                        {:else}
                            <OverviewMatch 
                                tournament={tournament} 
                                editable={tournament.round == roundId && tournament.ranks.length == 0 } 
                                match={round[matchId]} 
                                roundId={roundId} 
                                updateTournament={updateTournament}
                            />
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    </div>
    <div>
        <div>
            Losing Bracket
        </div>
        <div class="rounds-wrapper">
            {#each tournament.roundsAndMatches as round, roundId (roundId) }
                <div class="matches-wrapper">
                    {#each overview.losingBracket[roundId] as matchId, i (i) }
                        {#if matchId == -1}
                            <div class="placeholder" ></div>
                        {:else}
                            <OverviewMatch 
                                tournament={tournament} 
                                editable={tournament.round == roundId && tournament.ranks.length == 0 } 
                                match={round[matchId]} 
                                roundId={roundId} 
                                updateTournament={updateTournament}
                            />
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>


<style>
.rounds-wrapper{
    display: flex;
    gap: 40px;
}

.matches-wrapper{
    display: flex;
    flex-direction: column;
}

    .placeholder{
    display:grid;
    grid-template-columns: 200px 50px;
    grid-template-rows: 45px 45px 45px;
    grid-template-areas: 
        "match-title match-title"
        "match-player1-name match-player1-points"
        "match-player2-name match-player2-points"; 
    position: relative;
}

h3{
    margin: 0 0 40px 0;
}

</style>