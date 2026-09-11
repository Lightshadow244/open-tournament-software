<script lang="ts">
    import type { Tournament, Player } from '$lib/types/tournament';

    import CheckIcon from '@iconify-svelte/material-symbols/check';

    
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
        tournament: Tournament;
        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
		close(player: Player): void;
        player:Player;
	}

    let { tournament, close, player, updateTournament }: Props = $props();

    function changeIcon(icon:string){
        player.icon = icon;
        updateTournament(tournament);
    }

</script>

<div class="wrapper">
    <div class="color-selector">
        <!-- <label for="favcolor">Icon Color</label> -->
        <!-- <input bind:value={player.iconColor} type="color" id="favcolor" name="favcolor" onchange={(event) => changeIconColor((event.currentTarget as HTMLInputElement).value)}>  -->
        <input bind:value={player.iconColor} type="color" id="favcolor" name="favcolor" onchange={(event) => updateTournament(tournament)}>
    </div>
    <div class="icon-selector">
        <button class="ots-button {player.icon === "bishop"?"active":""}"   onclick={() => changeIcon("bishop")}> <ChessBishopIcon    height="1rem"/> </button>
        <button class="ots-button {player.icon === "knight"?"active":""}"   onclick={() => changeIcon("knight")}> <ChessKnightIcon    height="1rem"/> </button>
        <button class="ots-button {player.icon === "pawn"?"active":""}"     onclick={() => changeIcon("pawn")}> <ChessPawnIcon      height="1rem"/> </button>
        <button class="ots-button {player.icon === "rook"?"active":""}"     onclick={() => changeIcon("rook")}> <ChessRookIcon      height="1rem"/> </button>
        <button class="ots-button {player.icon === "cards"?"active":""}"    onclick={() => changeIcon("cards")}> <PlayingCardsIcon   height="1rem"/> </button>

        <button class="ots-button {player.icon === "diamond"?"active":""}"  onclick={() => changeIcon("diamond")}> <DiamondIcon        height="1rem"/> </button>
        <button class="ots-button {player.icon === "cannabis"?"active":""}" onclick={() => changeIcon("cannabis")}> <CannabisIcon       height="1rem"/> </button>
        <button class="ots-button {player.icon === "mask"?"active":""}"     onclick={() => changeIcon("mask")}> <DominoMaskIcon     height="1rem"/> </button>
        <button class="ots-button {player.icon === "star"?"active":""}"    onclick={() => changeIcon("star")}> <FamilyStarIcon     height="1rem"/> </button>
        <button class="ots-button {player.icon === "cross"?"active":""}"    onclick={() => changeIcon("cross")}> <HealthCrossIcon    height="1rem"/> </button>

        <button class="ots-button {player.icon === "rocket"?"active":""}"   onclick={() => changeIcon("rocket")}> <RocketIcon         height="1rem"/> </button>
        <button class="ots-button {player.icon === "snow"?"active":""}"     onclick={() => changeIcon("snow")}> <SnowflakeIcon      height="1rem"/> </button>
        <button class="ots-button {player.icon === "sunny"?"active":""}"    onclick={() => changeIcon("sunny")}> <SunnyIcon          height="1rem"/> </button>
        <button class="ots-button {player.icon === "tsunami"?"active":""}"  onclick={() => changeIcon("tsunami")}> <TsunamiIcon        height="1rem"/> </button>
        <button class="ots-button {player.icon === "wind"?"active":""}"     onclick={() => changeIcon("wind")}> <WindPowerIcon      height="1rem"/> </button>

        <button class="ots-button {player.icon === "pet"?"active":""}"      onclick={() => changeIcon("pet")}> <PetsIcon           height="1rem"/> </button>
        <button class="ots-button {player.icon === "owl"?"active":""}"      onclick={() => changeIcon("owl")}> <OwlIcon            height="1rem"/> </button>
        <button class="ots-button {player.icon === "raven"?"active":""}"    onclick={() => changeIcon("raven")}> <RavenIcon          height="1rem"/> </button>
        <button class="ots-button {player.icon === "snail"?"active":""}"    onclick={() => changeIcon("snail")}> <SnailIcon          height="1rem"/> </button>
        <button class="ots-button {player.icon === "hive"?"active":""}"     onclick={() => changeIcon("hive")}> <HiveIcon           height="1rem"/> </button>
    </div>
    <div class="apply">

        <button class="ots-button ots-button-success" onclick={() => close(player)}><CheckIcon height="1rem"/></button>
    </div>
    
</div>

<style>
    .wrapper{
        position: absolute;
        width: 400px;
        z-index:10;
        background-color: light-dark(var(--light-secondary), var(--dark-secondary));
        left: 40px;
        top: 0px;
        border-radius: 0.3rem;
    }

    .color-selector{
        margin: 10px;
        display: flex;
         align-items: center;
    }

    .color-selector input{
        width: 100%;
        border-radius: 0.3rem;
        border-style: solid;
        border-width: 1px 2px 2px 1px;
        border-color: light-dark(var(--light-border), var(--dark-border));
    }

    .icon-selector{
        margin: 0 10px 0 10px;
        display:flex;
        gap: 5px;
        flex-wrap: wrap;
    }

    .apply{
        margin: 10px;
    }

    .apply button{
        width: 100%;
    }

    .active{
        border-width: 2px 1px 1px 2px;
        border-color: light-dark(var(--light-hover), var(--dark-hover));
        transition: border-color 0.3s ease;
    }
</style>