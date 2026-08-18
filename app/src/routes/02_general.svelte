<script lang="ts">
import type { Tournament } from '$lib/types/tournament';
interface Props {
		tournament: Tournament;
        deleteTournament(id: string): void;
        updateTournament(tt: Tournament): void;
	}

let { tournament, deleteTournament, updateTournament }: Props = $props();
</script>


<form>
    <label for="title">Title</label>
    <input type="text" id="title" name="title">

    <div class="input-wrapper">
        <div class="input-element">
            <label for="date">Date</label>
            <input type="date" id="date" name="date">
        </div>
        <div class="input-element">
            <label for="time">Time</label>
            <input type="time" id="time" name="time">
        </div>
        <div class="input-element">
            <label for="location">Location</label>
            <input type="text" id="location" name="location">
        </div>
    </div>
    <div class="divider"></div>

    <legend>Tournament Mode</legend>
    <div class="mode-wrapper">
        <label class="mode-element" for="singleElimination">
            <input type="radio" id="singleElimination" name="mode" value="singleElimination" checked/>
            <span>Single Elimination</span>
        </label>

        <label class="mode-element" for="doubleElimination">
            <input type="radio" id="doubleElimination" name="mode" value="doubleElimination"/>
            <span>Double Elimination</span>
        </label>

        <label class="mode-element" for="roundRobin">
            <input type="radio" id="roundRobin" name="mode" value="roundRobin"/>
            <span>Round Robin</span>
        </label>

        <label class="mode-element" for="groupStageWithElimination">
            <input type="radio" id="groupStageWithElimination" name="mode" value="groupStageWithElimination"/>
            <span>Group Stage + Elimination</span>
        </label>

        <label class="mode-element" for="swissSystem">
            <input type="radio" id="swissSystem" name="mode" value="swissSystem"/>
            <span>Swiss System</span>
        </label>
    </div>

    <div class="divider"></div>

    <span>Participants</span>
    <table class="participants-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Strength</th>
                <th>Icon</th>
            </tr>
        </thead>
        <tbody>
            <tr>
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
            </tr>
        </tbody>
    </table>
    <div class="participants-wrapper"></div>
</form>
<!-- <button onclick={() => deleteTournament(tournament.id)}>Delete</button> -->


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

    input[type="text"],input[type="date"],input[type="time"]{
        background-color: rgba(255,255,255,0.0);
        border-radius: 0.3rem;
        border-style: solid;
        border-width: 2px;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
        padding:0;
        height:22px;
        
    }

    .divider{
        width: 100%;
        height: 1px;
        border-style:solid;
        border-width: 0 0 1px 0;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
        margin-top: 10px;
        margin-bottom: 0px;
    }

    
   

    .participants-table {
        border-spacing: 0;
        margin: 25px 0;
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
        padding: 12px 15px;
    }

    .participants-table tbody tr {
        border-bottom: 1px solid light-dark(var(--light-hover), var(--dark-hover));
    }

    .participants-table tbody tr:nth-of-type(even) *{
        /* background-color: #f3f3f3; */
        background-color: light-dark(var(--light-highlight), var(--dark-highlight));
    }

    .participants-table tbody tr:last-of-type {
        border-bottom: 2px solid light-dark(var(--light-hover), var(--dark-hover));
    }
</style>