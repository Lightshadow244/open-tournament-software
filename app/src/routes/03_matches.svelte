<script lang="ts">
    import type { Tournament } from '$lib/types/tournament';

    import { calculateSingleEliminationMatches } from '$lib/calculateMatches';

    interface Props {
            tournament: Tournament;
        }
    let { tournament }: Props = $props();

    if (tournament.status === "initializing") {
        console.log(calculateSingleEliminationMatches(tournament.participants))
    }else{
        console.log("not initializing")
    }
</script>