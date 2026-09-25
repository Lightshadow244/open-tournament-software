<script lang="ts">
    import type { Tournament, Player } from '$lib/types/tournament';
    import PlayerIcon from './PlayerIcon.svelte';

    interface Props {
        tournament: Tournament;
        }
    let { tournament }: Props = $props();

</script>

<div class="podium-wrapper">
    <div class="podium">
        <div class="first-rank">
            <h1>
            1#
            </h1>
            {#each tournament.ranks[0] as rank1 }
                <div class="first-rank-name">
                    {#if tournament.mode === "Round Robin"}
                        <PlayerIcon player={<Player>rank1[0]}/>: {rank1[1]} wins
                    {:else}
                        <PlayerIcon player={<Player>rank1[0]}/>
                    {/if}
                    
                </div> 
            {/each}
            <!-- <div class="first-rank-name">
                {tournament.ranks[0].name}
            </div> -->
        </div>
        <div class="other-ranks">
            <div>
                <h3>2#</h3> 
                <!-- <div>{tournament.ranks[1].name}</div> -->
                 {#each tournament.ranks[1] as rank2 }
                    <div>
                        {#if tournament.mode === "Round Robin"}
                            <PlayerIcon player={<Player>rank2[0]}/>: {rank2[1]} wins
                        {:else}
                            <PlayerIcon player={<Player>rank2[0]}/>
                        {/if}   
                    </div>
                {/each}
            </div>
            <div>
                <h3>3#</h3> 
                <!-- <div>{tournament.ranks[2].name}</div> -->
                {#each tournament.ranks[2] as rank3 }
                    <div>
                        {#if tournament.mode === "Round Robin"}
                            <PlayerIcon player={<Player>rank3[0]}/>: {rank3[1]} wins
                        {:else}
                            <PlayerIcon player={<Player>rank3[0]}/>
                        {/if}  
                    </div>
                {/each}
            </div>
            <div>
                <h3>4#</h3> 
                <!-- <div>{tournament.ranks[3].name}</div> -->
                {#each tournament.ranks[3] as rank4 }
                    <div>
                        {#if tournament.mode === "Round Robin"}
                            <PlayerIcon player={<Player>rank4[0]}/>: {rank4[1]} wins
                        {:else}
                            <PlayerIcon player={<Player>rank4[0]}/>
                        {/if}  
                    </div>
                {/each}
            </div>
        </div>
        
    </div>
</div>

<style>
    .podium-wrapper{
        display: flex;
    }
    .podium{
        border-radius: 0.3rem;
        border-style: solid;
        border-width: 2px;
        border-color: light-dark(var(--light-highlight), var(--dark-highlight));
        transition: border-color 0.3s ease;
        display:grid;
        gap: 0.25rem;
        background-color: rgba(255,255,255,0.0);
        margin: 0 auto 0 auto
    }
    .first-rank{
        margin: 3rem 3rem 1rem 3rem;
    }

    h1, h3{
        margin: 0;
        text-align: center;
    }

    .first-rank-name{
        text-align: center;
    }

    .other-ranks{
        display: flex;
        margin: 0 3rem 3rem 3rem;
        gap: 1rem;
    }

    .other-ranks>div>div{
        display: flex;
        align-items: center;
    }
</style>