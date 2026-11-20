<script lang="ts">
    import type { Tournament, FormattedMatch} from '$lib/types/tournament';
    import {calculateFillBlocks} from '$lib/types/tournament';

    import OverviewMatch from './OverviewMatch.svelte';

    interface Props {
        tournament: Tournament;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        triggerToast(msg:string, level:string): void;
        }
    let { tournament, updateTournament, triggerToast }: Props = $props();

    console.log("NOT IMPLEMENTED")
</script>