<script lang="ts">
    import type { Tournament} from '$lib/types/tournament';

    import { fillTemporaryMatches } from '$lib/calculateMatches';

    interface Props {
        tournament: Tournament;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        triggerToast(msg:string, level:string): void;
        }
    let { tournament, updateTournament, triggerToast }: Props = $props();


    function calculateFillBlocks(id:number):number{
        //returns f(x) = y = (f(x-1) * 2) + 1, x=0 y=0
        let result = 0;
        if (id != 0) {
            result = (calculateFillBlocks(id-1) * 2) + 1;
        }
        return(result);
    }

    let filledRoundsMatches = fillTemporaryMatches(tournament)
    console.log(filledRoundsMatches)
</script>

<div class="rounds-wrapper">
    {#each filledRoundsMatches as round, roundId (roundId) }
    <div class="matches-wrapper">

        {#if round[0].final}
            <h3 class="round-title">Final</h3>
        {:else if round[0].semiFinal}
            <h3 class="round-title">Semi-Final</h3>
        {:else}
            <h3 class="round-title">Round {roundId + 1}</h3>
        {/if}
        
        {#each Array(calculateFillBlocks(roundId)) as e, i (i)}
            <div class="match" ></div>
        {/each}
        {#each round as match, matchId (matchId) }
            <div 
                class="match {matchId % 2 == 0 && roundId != filledRoundsMatches.length - 1?"before-line-down":""} {roundId > 0?"after-line-left":""}"
                style="--height: {(calculateFillBlocks(roundId+1)) * 50}px;"
                >
                <div class="match-element">{match.player1?.name}</div>
                <div class="match-element">{match.player1Points}</div>
                <div class="match-element">{match.player2?.name}</div>
                <div class="match-element">{match.player2Points}</div>
            </div>
            <!-- {#each Array((roundId * 2) + 1) as e, i (i)} -->
            {#each Array(calculateFillBlocks(roundId + 1)) as e, i (i)}
                <div class="match" ></div>
            {/each}
        {/each}
    </div>
    
    {/each}
</div>


<style>
.rounds-wrapper{
    display: flex;
    gap: 40px;
}

.matches-wrapper{
    display: flex;
    flex-direction: column;
    /* gap: 40px;
    margin: 40px; */
}

.match{
    display:grid;
    grid-template-columns: 200px 50px;
    grid-template-rows: 25px 25px;
    position: relative;
}

/* .matches-wrapper .match:first-child{
    margin-top: auto;
}

.matches-wrapper .match:last-child{
    margin-bottom: auto;
} */

.match-element{
    /* height: 25px; */
    border-style: solid;
    border-width: 2px 2px 2px 2px;
    border-color: light-dark(var(--light-highlight), var(--dark-highlight));
}

.match .match-element:nth-child(1){
    border-top-left-radius: 0.3rem;
    border-width: 2px 2px 2px 2px;
}

.match .match-element:nth-child(2){
    border-top-right-radius: 0.3rem;
    border-width: 2px 2px 2px 0px;
}

.match .match-element:nth-child(3){
    border-bottom-left-radius: 0.3rem;
    border-width: 0px 2px 2px 2px;
}

.match .match-element:nth-child(4){
    border-bottom-right-radius: 0.3rem;
    border-width: 0px 2px 2px 0px;
}

.before-line-down::before{
    content: "";
    position: absolute;
    top: 50px;
    left: 224px;
    /* height: 46px; */
    height: var(--height);
    border-width: 0 0 0 3px;
    border-style: solid;
    border-color: light-dark(var(--light-highlight), var(--dark-highlight));
}

.after-line-left::after{
    content: "";
    position: absolute;
    top: 23px;
    left: -64px;
    width: 64px;
    border-width: 0 0 3px 0;
    border-style: solid;
    border-color: light-dark(var(--light-highlight), var(--dark-highlight));
}
</style>