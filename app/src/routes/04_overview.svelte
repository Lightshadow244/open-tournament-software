<script lang="ts">
    import type { Tournament, Player } from '$lib/types/tournament';

    import { fillTemporaryMatches } from '$lib/calculateMatches';

    interface Props {
        tournament: Tournament;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        triggerToast(msg:string, level:string): void;
        }
    let { tournament, updateTournament, triggerToast }: Props = $props();

    let filledMatches = fillTemporaryMatches(tournament)
    console.log(filledMatches)
</script>