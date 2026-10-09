<script lang="ts">
    import type { Match, Tournament, Player } from '$lib/types/tournament';
    import PlayerIcon from './PlayerIcon.svelte';

    import {changePlayerPointsForMatch} from '$lib/types/tournament';

    import CrownIcon from '@iconify-svelte/material-symbols/crown';
    interface Props {
        tournament: Tournament
        editable: boolean;
        match: Match;
        roundId: number;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
    }
    let { tournament,editable, match,  roundId, updateTournament,  }: Props = $props();

</script>
<div class="match">
    <div class="match-element match-title">
        {#if match.final}
            <h4>Final</h4>
        {:else if match.littleFinal}
            <h4>3rd-Place</h4>
        {:else}
            <h4>Match: {match.matchId + 1}</h4>
        {/if}
    </div>
    <div class="match-element match-player1-name with-icon">
        <div>
            <PlayerIcon player={<Player>match.player1}/>
        </div>
        <div class="{match.winnerId == 1?"crown":"crown-hidden"}">
            <CrownIcon height="1rem" color="currentcolor"/>
        </div>
    </div>
    <div class="match-element match-player1-points">
        <!-- svelte-ignore binding_property_non_reactive -->
        <input 
            type="{editable ? "number" : "text"}" 
            bind:value={match.player1Points}
            onchange={(event) => {updateTournament(changePlayerPointsForMatch(tournament, roundId, match.matchId, 1 ,Number((event.currentTarget as HTMLInputElement).value)))}} 
            disabled={editable ? false : true}
        >
    </div>
    <div class="match-element match-player2-name with-icon">
        <div>
            <PlayerIcon player={<Player>match.player2}/>
        </div>
        <div class="{match.winnerId == 2?"crown":"crown-hidden"}">
            <CrownIcon height="1rem" color="currentcolor"/>
        </div>
    </div>
    <div class="match-element match-player2-points">
        <!-- svelte-ignore binding_property_non_reactive -->
        <input 
            type="{editable ? "number" : "text"}" 
            bind:value={match.player2Points}
            onchange={(event) => {updateTournament(changePlayerPointsForMatch(tournament, roundId, match.matchId, 2 ,Number((event.currentTarget as HTMLInputElement).value)))}} 
            disabled={editable ? false : true}
        >
    </div>
</div>

<style>
    .match{
    display:grid;
    grid-template-columns: 200px 50px;
    grid-template-rows: 45px 45px 45px;
    grid-template-areas: 
        "match-title match-title"
        "match-player1-name match-player1-points"
        "match-player2-name match-player2-points"; 
    position: relative;
}

.match-title{
    grid-area: match-title;
}

.match-title h4 {
    margin:0.5rem 0 0 0.5rem;
}

.match-player1-name{
    grid-area: match-player1-name;
}

.match-player1-points{
    grid-area: match-player1-points;
}

.match-player2-name{
    grid-area: match-player2-name;
}

.match-player2-points{
    grid-area: match-player2-points;
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
    border-top-right-radius: 0.3rem;
    border-width: 2px 2px 2px 2px;
}

.match .match-element:nth-child(2){
    border-width: 0px 2px 2px 2px;
}

.match .match-element:nth-child(3){
    border-width: 0px 2px 2px 0px;
}

.match .match-element:nth-child(4){
    border-bottom-left-radius: 0.3rem;
    border-width: 0px 2px 2px 2px;
}

.match .match-element:nth-child(5){
    border-bottom-right-radius: 0.3rem;
    border-width: 0px 2px 2px 0px;
}

.crown{
    display: block;
}

.crown-hidden{
    display: none;
}
</style>
