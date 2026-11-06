<script lang="ts">
    import type { Tournament, FormattedMatch} from '$lib/types/tournament';
    import OverviewMatch from './OverviewMatch.svelte';

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
        tournament.roundsAndMatches.forEach((round, roundId) => {
            wb.push([]);

            round.forEach((match, matchId) => {
                let fm = {
                    matchId: match.matchId,
                    horLineWidth: 0,
                    verLineHeight: 0,
                    verLineLeft: 224,
                    verLineTop: 135,
                } as FormattedMatch;
                wb[roundId].push(fm)

                // placeholder between matches
                wb[roundId].push({matchId: -1} as FormattedMatch)
                
            })
        })
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