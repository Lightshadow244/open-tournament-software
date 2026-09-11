<script lang="ts">
	import type { Player } from '$lib/types/tournament';

    import ChessBishopIcon  from '@iconify-svelte/material-symbols/chess-bishop';
    import ChessKnightIcon  from '@iconify-svelte/material-symbols/chess-knight';
    import ChessPawnIcon    from '@iconify-svelte/material-symbols/chess-pawn';
    import ChessRookIcon    from '@iconify-svelte/material-symbols/chess-rook';
    import PlayingCardsIcon from '@iconify-svelte/material-symbols/playing-cards';

    import DiamondIcon      from '@iconify-svelte/material-symbols/diamond';
    import CannabisIcon     from '@iconify-svelte/material-symbols/cannabis';
    import DominoMaskIcon   from '@iconify-svelte/material-symbols/domino-mask';
    import FamilyStarIcon   from '@iconify-svelte/material-symbols/family-star';
    import HealthCrossIcon  from '@iconify-svelte/material-symbols/health-cross';

    import RocketIcon       from '@iconify-svelte/material-symbols/rocket';
    import SnowflakeIcon    from '@iconify-svelte/material-symbols/snowflake';
    import SunnyIcon        from '@iconify-svelte/material-symbols/sunny';
    import TsunamiIcon      from '@iconify-svelte/material-symbols/tsunami';
    import WindPowerIcon    from '@iconify-svelte/material-symbols/wind-power';

    import PetsIcon         from '@iconify-svelte/material-symbols/pets';
    import OwlIcon          from '@iconify-svelte/material-symbols/owl';
    import RavenIcon        from '@iconify-svelte/material-symbols/raven';
    import SnailIcon        from '@iconify-svelte/material-symbols/snail';
    import HiveIcon         from '@iconify-svelte/material-symbols/hive';

    interface Props {
        player: Player
	}

    let { player }: Props = $props();
</script>

{#if player}
    {#if player.icon === "bishop"}
        <ChessBishopIcon    height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "knight"}
        <ChessKnightIcon    height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "pawn"}
        <ChessPawnIcon      height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "rook"}
        <ChessRookIcon      height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "cards"}
        <PlayingCardsIcon   height="1rem" color={player.iconColor}/> 
    
    {:else if player.icon === "diamond"}
        <DiamondIcon        height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "cannabis"}
        <CannabisIcon       height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "mask"}
        <DominoMaskIcon     height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "star"}
        <FamilyStarIcon     height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "cross"}
        <HealthCrossIcon    height="1rem" color={player.iconColor}/> 

    {:else if player.icon === "rocket"}
        <RocketIcon         height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "snow"}
        <SnowflakeIcon      height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "sunny"}
        <SunnyIcon          height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "tsunami"}
        <TsunamiIcon        height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "wind"}
        <WindPowerIcon      height="1rem" color={player.iconColor}/> 

    {:else if player.icon === "pet"}
        <PetsIcon           height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "owl"}
        <OwlIcon            height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "raven"}
        <RavenIcon          height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "snail"}
        <SnailIcon          height="1rem" color={player.iconColor}/> 
    {:else if player.icon === "hive"}
        <HiveIcon           height="1rem" color={player.iconColor}/> 
    {/if}
{/if}


