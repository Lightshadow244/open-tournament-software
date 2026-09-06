<script lang="ts">
	import type { Player } from '$lib/types/tournament';

    import DiamondIcon from '@iconify-svelte/material-symbols/diamond';

    interface Props {
        player: Player
	}

    let { player }: Props = $props();
</script>

{#if player}
    {#if player.icon === "diamond"}
        <DiamondIcon height="1rem" color={player.iconColor}/>
    {/if}
{/if}


