<script lang="ts">
    import type { Tournament, Player } from '$lib/types/tournament';

    import { getLog2, calculateMatches } from '$lib/calculateMatches';
    import { randomIcon, randomColor } from '$lib/util';

    import PlayerIcon from './PlayerIcon.svelte';
    import IconSelector from './IconSelector.svelte';

    import RemoveRoundedIcon from '@iconify-svelte/material-symbols/remove-rounded';
    import Add2Icon from '@iconify-svelte/material-symbols/add-2';


    interface Props {
            tournament: Tournament;
            deleteTournament(id: string): void;
            updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
            triggerToast(msg:string, level:string): void;
        }

    let { tournament, deleteTournament, updateTournament, triggerToast }: Props = $props();

    function addPlayerToTournament(){
        tournament.players?.push({id: tournament.players.length,name:"Player " + (tournament.players.length + 1), icon: randomIcon(), iconColor: randomColor(), changeIcon: false})
        updateTournament(tournament);

        tournament.players.forEach((player, index) => {
            player.id=index;
        });
    }

    function removePlayerFromTournament(playerId:number){
        if (tournament.players.length > 0) {
            tournament.players.splice(playerId, 1);
            updateTournament(tournament);
        }

        tournament.players.forEach((player, index) => {
            player.id=index;
        });
    }

    function saveAndStartTournament(){
        if (tournament.mode === "Single Elimination") {
            // if (tournament.players.length % 4 == 0) {
            if (Number.isInteger(getLog2(tournament.players.length)) && tournament.players.length != 2) {
                tournament.roundsAndMatches = calculateMatches(tournament);
                updateTournament(tournament, false, false, true); 
            }else{
                triggerToast("Single Elimination needs player count: 4, 8, 16 ,32,...", "error")
            }
        }
    }

    function activateIconSelector(player:Player){
        tournament.players.forEach(p => {
            p.changeIcon = false;
        })

        player.changeIcon = true;
        updateTournament(tournament);
    }

    function closeIconSelector(player: Player){
        player.changeIcon = false;
        console.log(player);
        console.log(tournament.players[0]);
        updateTournament(tournament);
    }

</script>


<form>
    <label for="title">Title</label>
    <!-- svelte-ignore binding_property_non_reactive -->
    <input class="{tournament.status === "configuring" ? "" : "mode-disabled"}" type="text" id="title" name="title" bind:value={tournament.title} disabled={tournament.status === "configuring" ? false : true}>

    <div class="input-wrapper">
        <div class="input-element">
            <label for="date">Date</label>
            <!-- svelte-ignore binding_property_non_reactive -->
            <input class="{tournament.status === "configuring" ? "" : "mode-disabled"}" type="date" id="date" name="date" bind:value={tournament.date} disabled={tournament.status === "configuring" ? false : true}>
        </div>
        <div class="input-element">
            <label for="time">Time</label>
            <!-- svelte-ignore binding_property_non_reactive -->
            <input class="{tournament.status === "configuring" ? "" : "mode-disabled"}" type="time" id="time" name="time" bind:value={tournament.time} disabled={tournament.status === "configuring" ? false : true}>
        </div>
        <div class="input-element">
            <label for="location">Location</label>
            <!-- svelte-ignore binding_property_non_reactive -->
            <input class="{tournament.status === "configuring" ? "" : "mode-disabled"}" type="text" id="location" name="location" bind:value={tournament.location} disabled={tournament.status === "configuring" ? false : true}>
        </div>
    </div>
    <div class="divider"></div>

    <legend>Tournament Mode</legend>
    <div class="mode-wrapper">
        <label class="mode-element" for="singleElimination">
            <!-- svelte-ignore binding_property_non_reactive -->
            <input type="radio" id="singleElimination" name="mode" value="Single Elimination" bind:group={tournament.mode} disabled={tournament.status === "configuring" ? false : true}/>
            <span class="{tournament.status === "configuring" ? "" : "mode-disabled"}">Single Elimination</span>
        </label>

        <label class="mode-element" for="doubleElimination">
            <!-- svelte-ignore binding_property_non_reactive -->
            <input type="radio" id="doubleElimination" name="mode" value="Double Elimination" bind:group={tournament.mode} disabled={tournament.status === "configuring" ? false : true}/>
            <span class="{tournament.status === "configuring" ? "" : "mode-disabled"}">Double Elimination</span>
        </label>

        <label class="mode-element" for="roundRobin">
            <!-- svelte-ignore binding_property_non_reactive -->
            <input type="radio" id="roundRobin" name="mode" value="Round Robin" bind:group={tournament.mode} disabled={tournament.status === "configuring" ? false : true}/>
            <span class="{tournament.status === "configuring" ? "" : "mode-disabled"}">Round Robin</span>
        </label>

        <label class="mode-element" for="groupStageWithElimination">
            <!-- svelte-ignore binding_property_non_reactive -->
            <input type="radio" id="groupStageWithElimination" name="mode" value="Group Stage + Elimination" bind:group={tournament.mode} disabled={tournament.status === "configuring" ? false : true}/>
            <span class="{tournament.status === "configuring" ? "" : "mode-disabled"}">Group Stage + Elimination</span>
        </label>

        <label class="mode-element" for="swissSystem">
            <!-- svelte-ignore binding_property_non_reactive -->
            <input type="radio" id="swissSystem" name="mode" value="Swiss System" bind:group={tournament.mode} disabled={tournament.status === "configuring" ? false : true}/>
            <span class="{tournament.status === "configuring" ? "" : "mode-disabled"}">Swiss System</span>
        </label>
    </div>

    <div class="divider"></div>

    <legend>Participants</legend>

    {#if tournament.status === "configuring"}    
        <button class="ots-button button-add-participant" onclick={() => addPlayerToTournament()}>
            <Add2Icon height="1rem"/>
        </button>
    {/if}

    <table class="participants-table">
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <!-- <th>Strength</th> -->
                <th>Icon</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
        {#each tournament.players as p, i (i) }
            <tr>
                <td><div class="mode-disabled">{p.id + 1}</div></td>
                <!-- svelte-ignore binding_property_non_reactive -->
                <td><input class="{tournament.status === "configuring" ? "" : "mode-disabled"}" type="text" bind:value={p.name} disabled={tournament.status === "configuring" ? false : true}></td>
                <!-- svelte-ignore binding_property_non_reactive -->
                <!-- <td><input class="{tournament.status === "configuring" ? "" : "mode-disabled"}" type="text" bind:value={p.icon} disabled={tournament.status === "configuring" ? false : true}></td> -->
                 <td class="icon-cell">
                    {#if tournament.status === "configuring"}
                        <button class="ots-button" onclick={() => activateIconSelector(p)}>
                            <PlayerIcon player={p}/>
                        </button>
                    {:else}
                        <PlayerIcon player={p}/>
                    {/if}
                    {#if p.changeIcon}
                        <IconSelector close={closeIconSelector} player={p} tournament={tournament} updateTournament={updateTournament}/>
                    {/if}
                </td>
                
                <td class="participants-table-delete">
                    {#if tournament.status === "configuring"}
                        <button class="ots-button ots-button-danger" onclick={() => removePlayerFromTournament(i)}>
                            <RemoveRoundedIcon height="1rem" color="currentcolor"/>
                    
                        </button>
                    {/if}
                </td>
                
            </tr>
        {/each}
        </tbody>
    </table>
    <div class="participants-wrapper"></div>
</form>
{#if tournament.status === "configuring"}
    <div class="save-delete-wrapper">
        <button class="ots-button ots-button-success" onclick={() => saveAndStartTournament()}>Save & Start</button>
        <button class="ots-button ots-button-danger" onclick={() => deleteTournament(tournament.id)}>Delete</button>
    </div>
{:else if tournament.status !== "configuring"}
    <div class="configure-wrapper">
        <div>
            <button class="ots-button ots-button-warning" onclick={() => updateTournament(tournament, true)}>Configure</button>
            
            <div class="configure-info">
                <div class="configure-info-content">
                    <div class="configure-info-text">
                        Configuring the tournament again, will reset all match progress!
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}


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
        transition: all 0.3s ease;
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
        color: light-dark(var(--light-text), var(--dark-text));
        transition: all 0.3s ease;
        
    }
    input[type="text"].mode-disabled,input[type="date"].mode-disabled,input[type="time"].mode-disabled{
        color: light-dark(var(--light-disabled), var(--dark-disabled));
    }

    .mode-disabled{
        color: light-dark(var(--light-disabled), var(--dark-disabled));
    }

    .divider{
        width: 100%;
        height: 1px;
        border-style:solid;
        border-width: 0 0 1px 0;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
        transition: border-color 0.3s ease;
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
        transition: background-color 0.3s ease;
        text-align: left;
    }
    .participants-table th,
    .participants-table td {
        padding: 5px 5px;
        height: 30px;
    }

    .participants-table tbody tr {
        border-bottom: 1px solid light-dark(var(--light-hover), var(--dark-hover));
        transition: border-color 0.3s ease;
    }

    .participants-table tbody tr:nth-of-type(even) td{
        background-color: light-dark(var(--light-highlight), var(--dark-highlight));
        transition: background-color 0.3s ease;
    }

    .participants-table input {
        border:0;
        width: 100%;
        height: 100%;
    }

    .participants-table tbody tr:last-of-type {
        border-bottom: 2px solid light-dark(var(--light-hover), var(--dark-hover));
        transition: border-color 0.3s ease;
    }

    .participants-table-delete{
        display: flex;
    }

    .participants-table-delete button{
        margin-left: auto;
    }

    .configure-wrapper{
        display: flex;
    }

    .configure-wrapper div:first-child{
        position: relative;
    }

    .configure-wrapper div:first-child:hover .configure-info{
        display:block;
    }

    .configure-info{
        position: absolute;
        top: -35px;
        color: var(--light-text);
        background-color: var(--sulfur-yellow);
        border-radius: 0.3rem;
        padding:5px;
        display: none;
        width: max-content;
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

    .save-delete-wrapper{
        display: flex;
    }

    .save-delete-wrapper button:last-child{
        /* flex-grow: 1; */
        margin-left: auto;
    }

    .icon-cell{
        position:relative;
    }
    
</style>