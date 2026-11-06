<script lang="ts">
    import type { Tournament, Player, FormattedMatch} from '$lib/types/tournament';
    import {changePlayerPointsForMatch} from '$lib/types/tournament';
    import {calculateFillBlocks} from '$lib/types/tournament';
    import OverviewMatch from './OverviewMatch.svelte';

    import PlayerIcon from './PlayerIcon.svelte';

    import CrownIcon from '@iconify-svelte/material-symbols/crown';

    interface Props {
        tournament: Tournament;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        triggerToast(msg:string, level:string): void;
        }
    let { tournament, updateTournament, triggerToast }: Props = $props();

    let overviewStructure = {
        "winningBracket": [] as FormattedMatch[][] // [round] [formattedMatch]
    }

    function buildOverview(){
        let wb = overviewStructure.winningBracket;
        // let wbRoundCounter = 0;
        tournament.roundsAndMatches.forEach((round, roundId) => {
            wb.push([]);
            
            // placeholder before matches
            let preFillBlocks = calculateFillBlocks(roundId);
            if (roundId + 1 == tournament.roundsAndMatches.length) {
                preFillBlocks = preFillBlocks - 1;
            }

            for (let index = 0; index < preFillBlocks; index++) {
                wb[roundId].push({matchId: -1} as FormattedMatch)
            }

            // matches
            // first round and last round
            if(roundId == 0 || roundId + 1 == tournament.roundsAndMatches.length){

                if (roundId == 0) {
                        round.forEach((match, matchId) => {
                            let fm = {
                                matchId: match.matchId,
                                horLineWidth: 0,
                                verLineHeight: 0,
                                verLineLeft: 224,
                                verLineTop: 135,
                            } as FormattedMatch;
                            if(match.matchId % 2 == 0){
                                if (tournament.players.length == 4) {
                                    fm.verLineHeight = (calculateFillBlocks(roundId + 2)) * 135;
                                }else{
                                    fm.verLineHeight = (calculateFillBlocks(roundId + 1)) * 135;
                                }
                                 wb[roundId].push(fm)
                            }else{
                                wb[roundId].push(fm)
                            }

                            // placeholder between matches
                            if (matchId + 1 != round.length) {
                                let afterFillBlocks = calculateFillBlocks(roundId + 1)
                                if (tournament.players.length == 4) {
                                    afterFillBlocks = calculateFillBlocks(roundId + 2)
                                }
                                console.log(afterFillBlocks)
                                for (let index = 0; index < afterFillBlocks; index++) {
                                    wb[roundId].push({matchId: -1} as FormattedMatch)
                                }
                            }
                        })
                }else{

                    if (tournament.players.length == 4) {
                        wb[roundId].push({matchId: -1} as FormattedMatch)
                    }
                    
                    let fm = {
                        matchId: 0,
                        horLineWidth: 64,
                        verLineHeight: 0,
                        verLineLeft: 224,
                        verLineTop: 135,
                    } as FormattedMatch;

                    wb[roundId].push(fm)
                }

                
                // wbRoundCounter++
            }else{
                round.forEach((match, matchId) => {
                    let fm = {
                        matchId: match.matchId,
                        horLineWidth: 0,
                        verLineHeight: 0,
                        verLineLeft: 224,
                        verLineTop: 135,
                    } as FormattedMatch;
                    
                    if(match.matchId % 2 == 0){
                        fm.verLineHeight = (calculateFillBlocks(roundId + 1)) * 135
                    }
                    fm.horLineWidth = 64
                    
                    wb[roundId].push(fm)

                    // placeholder between matches
                    for (let index = 0; index < calculateFillBlocks(roundId + 1); index++) {
                        wb[roundId].push({matchId: -1} as FormattedMatch)
                    }
                })
            }
        })

        // add 3rd-place match
        wb[wb.length - 1].push({matchId: -1} as FormattedMatch)
        let thirdPlaceMatch = {
                        matchId: 1,
                        horLineWidth: 64,
                        verLineHeight: 0,
                        verLineLeft: 224,
                        verLineTop: 135,
                    } as FormattedMatch;
        wb[wb.length - 1].push(thirdPlaceMatch);
    }

    buildOverview();

</script>

<div>
    <div>
        <div class="rounds-wrapper">
            {#each tournament.roundsAndMatches as round, roundId (roundId) }
                <div class="matches-wrapper">
                    <h3 class="round-title">Round {roundId + 1}</h3>
                    {#each overviewStructure.winningBracket[roundId] as matchInfo, i (i) }
                        {#if matchInfo.matchId == -1}
                            <div class="placeholder" ></div>
                        {:else}
                            <OverviewMatch 
                                tournament={tournament} 
                                editable={tournament.round == roundId && tournament.ranks.length == 0 } 
                                match={round[matchInfo.matchId]} 
                                roundId={roundId} 
                                updateTournament={updateTournament}
                                horLineWidth={matchInfo.horLineWidth}
                                verLineHeight={matchInfo.verLineHeight}
                                verLineLeft={matchInfo.verLineLeft}
                                verLineTop={matchInfo.verLineTop}
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

</style>