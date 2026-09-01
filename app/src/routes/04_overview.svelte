<script lang="ts">
    import type { Tournament} from '$lib/types/tournament';

    import OverviewSE from './04a_overview_SE.svelte';

    interface Props {
        tournament: Tournament;

        updateTournament(tt: Tournament, configuring?:boolean, initializing?:boolean, running?:boolean): void;
        triggerToast(msg:string, level:string): void;
        }
    let { tournament, updateTournament, triggerToast }: Props = $props();

    let offsetX = $state(50);
    let offsetY = $state(50);
    let scale = $state(1);

    let area: HTMLDivElement;

    function startMovement(){
        area.addEventListener("mousemove", moveImage);
        area.addEventListener("mouseup", stopMovement);
        area.addEventListener("mouseleave", stopMovement);
    }

    function stopMovement(){
        area.removeEventListener("mousemove", moveImage);
        area.removeEventListener("mouseup", stopMovement)
        area.removeEventListener("mouseleave", stopMovement)
    }

    function moveImage(event: MouseEvent){
        event.preventDefault();
        offsetX += event.movementX;
        offsetY += event.movementY;
    }

    function zoom(event : WheelEvent) {
        event.preventDefault();

        scale += event.deltaY * -0.001;

        // Restrict scale
        scale = Math.min(Math.max(0.125, scale), 4);
    }
    
</script>
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div bind:this={area} class="overview-area" onmousedown={() => startMovement()} onwheel={(event) => zoom(event)} role="application" aria-label="tournament-overview-wrapper">
    <div class="overview-wrapper" style="left: {offsetX}px; top: {offsetY}px; transform:scale({scale});">
        {#if tournament.mode === "Single Elimination"}
            <OverviewSE tournament={tournament} updateTournament={updateTournament} triggerToast={triggerToast}/>
        {/if}
    </div>

</div>

<style>
    .overview-area{
        position: relative;
        width: 100%;
        height: calc(100vh - 4rem);
        overflow: hidden;
        background-color: light-dark(var(--light), var(--dark-secondary));
        border-radius: 0.3rem;
    }
    .overview-wrapper{
        position: absolute;
    }
</style>
