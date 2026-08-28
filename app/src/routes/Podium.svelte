<script lang="ts">
    import type { Tournament, Player } from '$lib/types/tournament';

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
            <div class="first-rank-name">
                {tournament.ranks[0].name}
            </div>
        </div>
        <div class="other-ranks">
            <div>
                <h3>2#</h3> 
                <div>{tournament.ranks[1].name}</div>
            </div>
            <div>
                <h3>3#</h3> 
                <div>{tournament.ranks[2].name}</div>
            </div>
            <div>
                <h3>4#</h3> 
                <div>{tournament.ranks[3].name}</div>
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

    .other-ranks>div{
        display: flex;
    }

    .other-ranks>div>div{
        margin-left: 1rem;
    }
</style>