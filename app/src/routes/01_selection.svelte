<script>
    import ChessIcon from '@iconify-svelte/material-symbols/chess';
    import SupervisorAccountIcon from '@iconify-svelte/material-symbols/supervisor-account';
    import MyLocationIcon from '@iconify-svelte/material-symbols/my-location';
    import CalendarTodayIcon from '@iconify-svelte/material-symbols/calendar-today';
    import Add2Icon from '@iconify-svelte/material-symbols/add-2';
</script>

<div class="tournament-wrapper">
    <div class="tournament add">
        <Add2Icon height="1.5rem"/>
    </div>
    <div class="tournament">
        <h3 class="title">Tournament-Title</h3>
        <div class="attributes-wrapper">
            <div class="attribute">
                <ChessIcon height="1rem" color="currentcolor"/> Tournament-Modus
            </div>
            <div class="attribute">
                <SupervisorAccountIcon height="1rem" color="currentcolor"/> 5
            </div>
            <div class="attribute">
                <CalendarTodayIcon height="1rem" color="currentcolor"/> 02/08/2026
            </div>
            <div class="attribute">
                <MyLocationIcon height="1rem" color="currentcolor"/> Magdeburg
            </div>
        </div>
    </div>

    <div class="tournament">
        <h3 class="title">Tournament-Title</h3>
        <div class="attributes-wrapper">
            <div class="attribute">
                <ChessIcon height="1rem" color="currentcolor"/> Tournament-Modus
            </div>
            <div class="attribute">
                <SupervisorAccountIcon height="1rem" color="currentcolor"/> 5
            </div>
            <div class="attribute">
                <CalendarTodayIcon height="1rem" color="currentcolor"/> 02/08/2026
            </div>
            <div class="attribute">
                <MyLocationIcon height="1rem" color="currentcolor"/> Magdeburg
            </div>
        </div>
    </div>

    <div class="tournament">
        <h3 class="title">Tournament-Title</h3>
        <div class="attributes-wrapper">
            <div class="attribute">
                <ChessIcon height="1rem" color="currentcolor"/> Tournament-Modus
            </div>
            <div class="attribute">
                <SupervisorAccountIcon height="1rem" color="currentcolor"/> 5
            </div>
            <div class="attribute">
                <CalendarTodayIcon height="1rem" color="currentcolor"/> 02/08/2026
            </div>
            <div class="attribute">
                <MyLocationIcon height="1rem" color="currentcolor"/> Magdeburg
            </div>
        </div>
    </div>
</div>


<style>
.tournament-wrapper{
    display:grid;
    gap: 1rem;
    
}
.tournament{
    border-radius: 0.3rem;
    border-style: solid;
    border-width: 1px 2px 2px 1px;
    border-color: light-dark(var(--light-highlight), var(--dark-highlight));
    padding: 10px;
    display:grid;
    gap: 0.25rem;
}

.tournament:active{
    border-width: 2px 1px 1px 2px;
}

.tournament:hover{
    border-color: light-dark(var(--light-hover), var(--dark-hover));
}

.add{
    display:flex;
    justify-content: center;
    align-items: center;
}

.title{
    margin:0;
}

.attributes-wrapper{
    display: flex;
    /* gap:3rem; */
    justify-content: center;
    align-items: center;
}
.attribute{
    display:flex;
    align-items: center;
    justify-content: center;
    gap:0.5rem;
    margin: 0 auto 0 auto
    
}
</style>