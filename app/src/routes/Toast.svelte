<script lang="ts">
    import { fade } from 'svelte/transition';

    import CloseSmallRoundedIcon from '@iconify-svelte/material-symbols/close-small-rounded';
    let props = $props();

    console.log(props.toastContent);
    
</script>

{#if props.toastLevel === "error"}
    <div class="toast toast-danger" transition:fade>
        <div>
            {props.toastContent}
        </div>
        <button onclick={() => props.hideToast()}>
            <CloseSmallRoundedIcon height="1rem" color="currentcolor"/>
        </button>
    </div>
{:else if props.toastLevel === "warning"}
    <div class="toast toast-warning" transition:fade>
        <div>
            {props.toastContent}
        </div>
        <button onclick={() => props.hideToast()}>
            <CloseSmallRoundedIcon height="1rem" color="currentcolor"/>
        </button>
    </div>
{:else if props.toastLevel === "success"}   
    <div class="toast toast-success" transition:fade>
        <div>
            {props.toastContent}
        </div>
        <button onclick={() => props.hideToast()}>
            <CloseSmallRoundedIcon height="1rem" color="currentcolor"/>
        </button>
    </div>
{/if}

<style>
    .toast{
        position: fixed;
        display: flex;
        bottom: 5px;
        padding: 5px;
        gap: 5px;
        left: 50%;
        border-radius: 0.3rem;
        border-style: solid;
        border-width: 2px 2px 2px 2px;
        background-color: light-dark(var(--light), var(--dark-secondary));
    }

    .toast button{
        border-radius: 0.3rem;
        border-width: 0;
        display:flex;
        align-items: center;
    }

    .toast-warning{
        border-color: var(--sulfur-yellow);
    }

    .toast-danger{
        border-color: var(--wine-red);
    }

    .toast-success{
        border-color: var(--scale-green);
    }
</style>

