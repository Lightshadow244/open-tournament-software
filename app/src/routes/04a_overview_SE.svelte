<script lang="ts">
    import type { Tournament, Player} from '$lib/types/tournament';
    import {changePlayerPointsForMatch} from '$lib/types/tournament';

    import PlayerIcon from './PlayerIcon.svelte';

    import CrownIcon from '@iconify-svelte/material-symbols/crown';

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
</script>

<div class="rounds-wrapper">
    {#each tournament.roundsAndMatches as round, roundId (roundId) }
    <div class="matches-wrapper">

        {#if round[0].final}
            <h3 class="round-title">Final</h3>
        {:else if round[0].semiFinal}
            <h3 class="round-title">Semi-Final</h3>
        {:else}
            <h3 class="round-title">Round {roundId + 1}</h3>
        {/if}
        
        <!-- add placeholder before matches -->
        <!-- when only 2 rounds different behaviour for final match -->
        {#if !tournament.roundsAndMatches[roundId][0].final || tournament.roundsAndMatches.length == 2}
            {#each Array(calculateFillBlocks(roundId)) as e, i (i)}
                <div class="match" ></div>
            {/each}
        {:else}
            {#each Array(calculateFillBlocks(roundId) -1) as e, i (i)}
                <div class="match" ></div>
            {/each}
        {/if}
        
        {#each round as match, matchId (matchId) }
            <div 
                // every even match and not last match > line down
                // not first and not last match > line left
                class="match {matchId % 2 == 0 && roundId != tournament.roundsAndMatches.length - 1?"before-line-down":""} {roundId > 0?"after-line-left":""}"
                style="--height: {tournament.roundsAndMatches.length > 2?(calculateFillBlocks(roundId+1)) * 90:(calculateFillBlocks(roundId+1)) * 180}px;"
                >
                <div class="match-element with-icon">
                    <div>{match.player1?.name}</div>
                    <PlayerIcon player={<Player>match.player1}/>
                    <div class="{match.winnerId == 1?"crown":"crown-hidden"}">
                        <CrownIcon height="1rem" color="currentcolor"/>
                    </div>
                </div>
                <div class="match-element">
                    <!-- svelte-ignore binding_property_non_reactive -->
                    <input 
                        type="{tournament.round == roundId && tournament.ranks.length == 0 ? "number" : "text"}" 
                        bind:value={match.player1Points}
                        onchange={(event) => {updateTournament(changePlayerPointsForMatch(tournament, roundId, matchId, 1 ,Number((event.currentTarget as HTMLInputElement).value)))}} 
                        disabled={tournament.round == roundId && tournament.ranks.length == 0 ? false : true}
                    >
                </div>

                <div class="match-element  with-icon">
                    <div>{match.player2?.name}</div>
                    <PlayerIcon player={<Player>match.player2}/>
                    <div class="{match.winnerId == 2?"crown":"crown-hidden"}">
                        <CrownIcon height="1rem" color="currentcolor"/>
                    </div>
                </div>
                <div class="match-element">
                    <!-- svelte-ignore binding_property_non_reactive -->
                    <input 
                        type="{tournament.round == roundId && tournament.ranks.length == 0 ? "number" : "text"}" 
                        bind:value={match.player2Points}
                        onchange={(event) => {updateTournament(changePlayerPointsForMatch(tournament, roundId, matchId, 2 ,Number((event.currentTarget as HTMLInputElement).value)))}} 
                        disabled={tournament.round == roundId && tournament.ranks.length == 0 ? false : true}
                    >
                </div>
            </div>
            <!-- add placeholder between matches -->
            <!-- when final add only one placeholder, but when only 2 rounds add zero placeholder for final -->
            {#if !tournament.roundsAndMatches[roundId][0].final}
                {#if tournament.roundsAndMatches.length > 2}
                    {#each Array(calculateFillBlocks(roundId + 1)) as e, i (i)}
                        <div class="match" ></div>
                    {/each}
                {:else}
                    {#each Array(calculateFillBlocks(roundId + 1) * 2) as e, i (i)}
                        <div class="match" ></div>
                    {/each}
                {/if}
            {:else}
                {#if tournament.roundsAndMatches.length > 2}
                    <div class="match" ></div>
                {/if}
                
            {/if}
            
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
}

.match{
    display:grid;
    grid-template-columns: 200px 50px;
    grid-template-rows: 45px 45px;
    position: relative;
}


.match-element{
    border-style: solid;
    border-width: 2px 2px 2px 2px;
    border-color: light-dark(var(--light-highlight), var(--dark-highlight));
}

.with-icon{
    display:flex;
    align-items: center;
}

.match-element div{
    margin:10px;
}

.match-element input{
    background-color: rgba(255,255,255,0.0);
    width: calc(100% - 10px);
    height: calc(100% - 20px);
    border:0;
    margin: 10px 10px 10px 5px;
    padding:0;
    text-align: center;
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
    top: 90px;
    left: 224px;
    height: var(--height);
    border-width: 0 0 0 3px;
    border-style: solid;
    border-color: light-dark(var(--light-highlight), var(--dark-highlight));
}

.after-line-left::after{
    content: "";
    position: absolute;
    top: 43px;
    left: -64px;
    width: 64px;
    border-width: 0 0 3px 0;
    border-style: solid;
    border-color: light-dark(var(--light-highlight), var(--dark-highlight));
}

.crown{
    display: block;
}

.crown-hidden{
    display: none;
}

h3{
    margin: 0 0 40px 0;
}
</style>