<script lang="ts">
import RemoveRoundedIcon from '@iconify-svelte/material-symbols/remove-rounded';
import Add2Icon from '@iconify-svelte/material-symbols/add-2';


import type { Tournament } from '$lib/types/tournament';
interface Props {
		tournament: Tournament;
        deleteTournament(id: string): void;
        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        addPlayerToTournament(tt:Tournament): void;
        removePlayerFromTournament(tt:Tournament, participantId:number): void;
	}

let { tournament, deleteTournament, updateTournament, addPlayerToTournament, removePlayerFromTournament }: Props = $props();

</script>


<form>
    <label for="title">Title</label>
    <!-- <input type="text" id="title" name="title" bind:value={tournament.title} onfocusout={() => updateTournament(tournament)}> -->
    <input class="{tournament.status === "configuring" ? "" : "mode-disabled"}" type="text" id="title" name="title" bind:value={tournament.title} disabled={tournament.status === "configuring" ? false : true}>

    <div class="input-wrapper">
        <div class="input-element">
            <label for="date">Date</label>
            <input type="date" id="date" name="date" bind:value={tournament.date} disabled={tournament.status === "configuring" ? false : true}>
        </div>
        <div class="input-element">
            <label for="time">Time</label>
            <input type="time" id="time" name="time" bind:value={tournament.time} disabled={tournament.status === "configuring" ? false : true}>
        </div>
        <div class="input-element">
            <label for="location">Location</label>
            <input type="text" id="location" name="location" bind:value={tournament.location} disabled={tournament.status === "configuring" ? false : true}>
        </div>
    </div>
    <div class="divider"></div>

    <legend>Tournament Mode</legend>
    <div class="mode-wrapper">
        <label class="mode-element" for="singleElimination">
            <input type="radio" id="singleElimination" name="mode" value="Single Elimination" bind:group={tournament.mode} disabled={tournament.status === "configuring" ? false : true}/>
            <span class="{tournament.status === "configuring" ? "" : "mode-disabled"}">Single Elimination</span>
        </label>

        <label class="mode-element" for="doubleElimination">
            <input type="radio" id="doubleElimination" name="mode" value="Double Elimination" bind:group={tournament.mode} disabled={tournament.status === "configuring" ? false : true}/>
            <span class="{tournament.status === "configuring" ? "" : "mode-disabled"}">Double Elimination</span>
        </label>

        <label class="mode-element" for="roundRobin">
            <input type="radio" id="roundRobin" name="mode" value="Round Robin" bind:group={tournament.mode} disabled={tournament.status === "configuring" ? false : true}/>
            <span class="{tournament.status === "configuring" ? "" : "mode-disabled"}">Round Robin</span>
        </label>

        <label class="mode-element" for="groupStageWithElimination">
            <input type="radio" id="groupStageWithElimination" name="mode" value="Group Stage + Elimination" bind:group={tournament.mode} disabled={tournament.status === "configuring" ? false : true}/>
            <span class="{tournament.status === "configuring" ? "" : "mode-disabled"}">Group Stage + Elimination</span>
        </label>

        <label class="mode-element" for="swissSystem">
            <input type="radio" id="swissSystem" name="mode" value="Swiss System" bind:group={tournament.mode} disabled={tournament.status === "configuring" ? false : true}/>
            <span class="{tournament.status === "configuring" ? "" : "mode-disabled"}">Swiss System</span>
        </label>
    </div>

    <div class="divider"></div>

    <legend>Participants</legend>

    {#if tournament.status === "configuring"}    
        <button class="ots-button button-add-participant" onclick={() => addPlayerToTournament(tournament)}>
            <Add2Icon height="1rem"/>
        </button>
    {/if}

    <table class="participants-table">
        <thead>
            <tr>
                <th>Name</th>
                <!-- <th>Strength</th> -->
                <th>Icon</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
        {#each tournament.players as p, i (i) }
            <tr>
                <td><input type="text" bind:value={p.name} disabled={tournament.status === "configuring" ? false : true}></td>
                <td><input type="text" bind:value={p.icon} disabled={tournament.status === "configuring" ? false : true}></td>
                
                <td class="participants-table-delete">
                    {#if tournament.status === "configuring"}
                        <button class="ots-button ots-button-danger" onclick={() => removePlayerFromTournament(tournament, i)}>
                            <RemoveRoundedIcon height="1rem" color="currentcolor"/>
                    
                        </button>
                    {/if}
                </td>
                
            </tr>
        {/each}
            <!-- <tr>
                <td>Richi</td>
                <td>3</td>
                <td>circle</td>
            </tr>
            <tr>
                <td>Nici</td>
                <td>2</td>
                <td>triangle</td>
            </tr>
            <tr>
                <td>Johnny</td>
                <td>4</td>
                <td>quadrate</td>
            </tr>
            <tr>
                <td>Johnny</td>
                <td>4</td>
                <td>quadrate</td>
            </tr> -->
        </tbody>
    </table>
    <div class="participants-wrapper"></div>
</form>
<div class="save-delete-wrapper">
    {#if tournament.status === "configuring"}
        <button class="ots-button ots-button-success" onclick={() => updateTournament(tournament, false, true)}>Save & Start</button>
        <button class="ots-button ots-button-danger" onclick={() => deleteTournament(tournament.id)}>Delete</button>
    {:else if tournament.status !== "configuring"}
        <button class="ots-button ots-button-warning" onclick={() => updateTournament(tournament, true)}>Configure</button>
        
        <div class="configure-info">
            <div class="configure-info-content">
                <div class="configure-info-text">
                    Configuring the tournament again, will reset all match progress!
                </div>
            </div>
        </div>
        
    {/if}
</div>


<style>
    input{
        width:100%
    }
    form{
        display: flex;
        flex-direction: column;
        gap:5px;
    }

    .input-wrapper{
        display: flex;
        gap: 1rem;
    }

    .input-element{
        flex-grow: 1;
    }

    .mode-wrapper{
        display:flex;
        gap: 10px;
        border: none;
        width:100%;
    }

    .mode-element{
        display: flex;
        flex-grow:1;
        position: relative;
    }

    .mode-element input[type="radio"]{
        opacity: 0;
        position: absolute;
    }

    .mode-element span{
        width: 100%;
        height: 25px;
        border-width: 2px;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
        border-style: solid;
        border-radius: 0.3rem;
        background-color: rgba(255,255,255,0.0);
    }

    .mode-element input[name="mode"]:checked + span{
        border-color: var(--scale-green);
    }

    .mode-element input[name="mode"]:focus + span{
        outline: auto;
    }

    .mode-disabled{
        color: light-dark(var(--light-disabled), var(--dark-disabled));
    }

    .button-add-participant{
        width: 2rem;
    }

    input[type="text"],input[type="date"],input[type="time"]{
        background-color: rgba(255,255,255,0.0);
        border-radius: 0.3rem;
        border-style: solid;
        border-width: 2px;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
        padding:0;
        height:25px;
        font-size: 1rem;
    }

    .divider{
        width: 100%;
        height: 1px;
        border-style:solid;
        border-width: 0 0 1px 0;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .participants-table {
        border-spacing: 0;
        font-size: 0.9em;
        font-family: sans-serif;
        width: 100%;
    }

    .participants-table tr:last-child td:first-child {
        border-bottom-left-radius: 0.3rem;
    }
        
    .participants-table tr:last-child td:last-child {
        border-bottom-right-radius: 0.3rem;
        
    }

    .participants-table tr th:first-child{
        border-top-left-radius: 0.3rem;
    }
    .participants-table tr th:last-child{
        border-top-right-radius: 0.3rem;
    }

    .participants-table thead tr *{
        background-color: light-dark(var(--light-hover), var(--dark-hover));
        text-align: left;
    }
    .participants-table th,
    .participants-table td {
        padding: 5px 5px;
        height: 25px;
    }

    .participants-table tbody tr {
        border-bottom: 1px solid light-dark(var(--light-hover), var(--dark-hover));
    }

    .participants-table tbody tr:nth-of-type(even) td{
        background-color: light-dark(var(--light-highlight), var(--dark-highlight));
    }

    /* .participants-table tbody tr td{
        border-style: solid;
        border-width: 1px 0 0 0;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
    } */

    .participants-table input {
        border:0;
        width: 100%;
        height: 100%;
    }

    .participants-table tbody tr:last-of-type {
        border-bottom: 2px solid light-dark(var(--light-hover), var(--dark-hover));
    }

    .participants-table-delete{
        display: flex;
    }

    .participants-table-delete button{
        margin-left: auto;
    }

    .save-delete-wrapper{
        display: flex;
        gap: 5px;
        position: relative;
    }

    /* .save-delete-wrapper button:first-child{
        flex-grow: 4; 
    } */
    .save-delete-wrapper button:last-child{
        /* flex-grow: 1; */
        margin-left: auto;
    }

    .configure-info{
        position: absolute;
        top: -35px;
        color: var(--light-text);
        background-color: var(--sulfur-yellow);
        border-radius: 0.3rem;
        padding:5px;
        display: none;
        
    }

    .configure-info-content{
        position: relative;
    }

    .configure-info-content:before {
    content: "";
    width: 20px;
    height: 20px;
    transform: rotate(45deg);
    background: var(--sulfur-yellow);
    position: absolute;
    left: 10px;
    top:8px;
    z-index: 1;
    }

    .configure-info-text{
        z-index: 2;
        position: relative;
    }

    .save-delete-wrapper:hover .configure-info{
        display:block;
    }
</style>