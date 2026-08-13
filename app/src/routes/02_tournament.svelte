<script lang="ts">
import type { Tournament } from '$lib/types/tournament';
interface Props {
		tournament: Tournament;
        deleteTournament(id: string): void;
        updateTournament(tt: Tournament): void;
	}

let { tournament, deleteTournament, updateTournament }: Props = $props();
</script>

<div class="tournament-header">
    <!-- <button>Settings</button>
    <button>Matches</button>
    <button>Overview</button> -->
    <button onclick={() => deleteTournament(tournament.id)}>Delete</button>
</div>
<div>{tournament.id}</div>


<style>
    .tournament-header{
        display: flex;
    }
</style>