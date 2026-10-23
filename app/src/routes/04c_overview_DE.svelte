<script lang="ts">
    import type { Tournament, FormattedMatch} from '$lib/types/tournament';
    import {calculateFillBlocks} from '$lib/types/tournament';

    import OverviewMatch from './OverviewMatch.svelte';


    interface Props {
        tournament: Tournament;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        triggerToast(msg:string, level:string): void;
        }
    let { tournament, updateTournament, triggerToast }: Props = $props();

    let overview = {
        "winningBracket": [] as FormattedMatch[][], // [round] [formattedMatch]
        "losingBracket": [] as FormattedMatch[][],
    }


    function buildOverview(){
        let wb = overview.winningBracket;
        let wbRoundCounter = 0;
        tournament.roundsAndMatches.forEach((round, roundId) => {
            wb.push([]);
            
            // placeholder before matches
            for (let index = 0; index < calculateFillBlocks(wbRoundCounter); index++) {
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
                                fm.verLineHeight = (calculateFillBlocks(wbRoundCounter + 1)) * 135;
                                 wb[roundId].push(fm)
                            }else{
                                wb[roundId].push(fm)
                            }

                            // placeholder between matches
                            if (matchId + 1 != round.length) {
                                for (let index = 0; index < calculateFillBlocks(wbRoundCounter + 1); index++) {
                                    wb[roundId].push({matchId: -1} as FormattedMatch)
                                }
                            }
                        })
                }else{
                    let fm = {
                        matchId: 0,
                        horLineWidth: 0,
                        verLineHeight: 0,
                        verLineLeft: 224,
                        verLineTop: 135,
                    } as FormattedMatch;

                    fm.horLineWidth = (2 * 40) + 23 + 250;
                    fm.verLineHeight = ((calculateFillBlocks(wbRoundCounter - 1)) * 135) + 94;
                    fm.verLineLeft = -66;
                    fm.verLineTop = 65

                    wb[roundId].push(fm)
                }

                
                wbRoundCounter++
            }else{
                if(round[0].winningBracket){
                    round.slice(0, round.length / 2).forEach((match, matchId) => {
                        let fm = {
                            matchId: match.matchId,
                            horLineWidth: 0,
                            verLineHeight: 0,
                            verLineLeft: 224,
                            verLineTop: 135,
                        } as FormattedMatch;

                        // line from semi final to final has to be shorter + a offset
                        if (roundId == tournament.roundsAndMatches.length - 3) {
                            fm.verLineHeight = (calculateFillBlocks(wbRoundCounter)) * 135 + 68;
                        }else{
                            fm.verLineHeight = (calculateFillBlocks(wbRoundCounter + 1)) * 135
                        }

                        if (roundId == 1) {
                            fm.horLineWidth = 64
                        }else{
                            fm.horLineWidth = (2 * 40) + 23 + 250; // 2x gap + offset left + width match

                        }

                        if(match.matchId % 2 == 0){
                            wb[roundId].push(fm)
                        }else{
                            fm.verLineHeight = 0;
                            fm.verLineLeft = 0;
                            wb[roundId].push(fm)
                        }


                        // placeholder between matches
                        if (matchId + 1 != round.length / 2) {
                            for (let index = 0; index < calculateFillBlocks(wbRoundCounter + 1); index++) {
                                wb[roundId].push({matchId: -1} as FormattedMatch)
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
                lb[roundId].push({matchId: -1} as FormattedMatch)
                lbRoundCounter++;
            }else{
                // placeholder before matches
                for (let index = 0; index < calculateFillBlocks(lbRoundCounter); index++) {
                    lb[roundId].push({matchId: -1} as FormattedMatch)
                }

                if(round[0].winningBracket){
                    round.slice(round.length / 2, round.length ).forEach((match, matchId) => {
                        let fm = {
                            matchId: match.matchId,
                            horLineWidth: 0,
                            verLineHeight: 0,
                            verLineLeft: 224,
                            verLineTop: 135,
                        } as FormattedMatch;

                         if (roundId > 1) {
                            fm.horLineWidth = 65;
                        }

                        lb[roundId].push(fm)

                        // placeholder between matches
                        if (matchId + 1 != round.length / 2) {
                            for (let index = 0; index < calculateFillBlocks(lbRoundCounter + 1); index++) {
                                lb[roundId].push({matchId: -1} as FormattedMatch)
                            }
                        }
                    })
                }else{
                    round.forEach((match, matchId) => {
                        let fm = {
                            matchId: match.matchId,
                            horLineWidth: 0,
                            verLineHeight: 0,
                            verLineLeft: 224,
                            verLineTop: 135,
                        } as FormattedMatch;

                       if (roundId > 1) {
                            fm.horLineWidth = 40;
                        }

                        if (matchId % 2 == 0 && roundId != tournament.roundsAndMatches.length - 2) { 
                            fm.verLineHeight = (calculateFillBlocks(lbRoundCounter + 1)) * 135;
                        }

                        lb[roundId].push(fm);

                        // placeholder between matches
                        if (matchId + 1 != round.length) {
                            for (let index = 0; index < calculateFillBlocks(lbRoundCounter + 1); index++) {
                                lb[roundId].push({matchId: -1} as FormattedMatch)
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
                    {#each overview.winningBracket[roundId] as matchInfo, i (i) }
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
    <div>
        <div>
            Losing Bracket
        </div>
        <div class="rounds-wrapper">
            {#each tournament.roundsAndMatches as round, roundId (roundId) }
                <div class="matches-wrapper">
                    {#each overview.losingBracket[roundId] as matchInfo, i (i) }
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