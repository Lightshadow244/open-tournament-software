<script lang="ts">
    import type { Tournaments } from '$lib/types/tournament';

    import ChessIcon from '@iconify-svelte/material-symbols/chess';
    import SupervisorAccountIcon from '@iconify-svelte/material-symbols/supervisor-account';
    import MyLocationIcon from '@iconify-svelte/material-symbols/my-location';
    import CalendarTodayIcon from '@iconify-svelte/material-symbols/calendar-today';
    import Add2Icon from '@iconify-svelte/material-symbols/add-2';

    interface Props {
		tournaments: Tournaments;
        createNewTournament(): void;
        selectTournament(id:string): void;
	}

	let { tournaments, createNewTournament, selectTournament }: Props = $props();

</script>

<div class="tournament-wrapper">
    <button class="tournament add" onclick={() => createNewTournament()}>
        <Add2Icon height="1.5rem"/>
    </button>
    {#each Object.entries(tournaments) as [id, tournament] (id)}
        <button class="tournament" onclick={() => selectTournament(id)}>
            <h3 class="title">{tournament.title}</h3>
            <div class="attributes-wrapper">
                <div class="attribute">
                    <ChessIcon height="1rem" color="currentcolor"/> {tournament.mode}
                </div>
                <div class="attribute">
                    <SupervisorAccountIcon height="1rem" color="currentcolor"/> {tournament.participants.length}
                </div>
                <div class="attribute">
                    <CalendarTodayIcon height="1rem" color="currentcolor"/> {tournament.date}, {tournament.time}
                </div>
                <div class="attribute">
                    <MyLocationIcon height="1rem" color="currentcolor"/> {tournament.location}
                </div>
            </div>
        </button>
    {/each}
    
</div>


<style>
.tournament-wrapper{
    display:grid;
    gap: 1rem;
    
}
.tournament{
    border-radius: 0.3rem;
    border-style: solid;
    border-width: 1px 2px 2px 1px;
    border-color: light-dark(var(--light-highlight), var(--dark-highlight));
    padding: 10px;
    display:grid;
    gap: 0.25rem;
    background-color: rgba(255,255,255,0.0);
    text-align: left;
}

.tournament:active{
    border-width: 2px 1px 1px 2px;
}

.tournament:hover{
    border-color: light-dark(var(--light-hover), var(--dark-hover));
    cursor: pointer;
}

.add{
    display:flex;
    justify-content: center;
    align-items: center;
}

.title{
    margin:0;
}

.attributes-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
}
.attribute{
    display:flex;
    flex: 1 1 0px;
    align-items: center;
    gap:0.5rem;
    margin: 0 auto 0 auto
    
}

</style>