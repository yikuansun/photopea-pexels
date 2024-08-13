<script>
    export let thickness = 4;
    export let radius = 16;
    export let style = "";
    export let color = "grey";
    export let onClick = null;
    export let rounded = true;
</script>

<button class="x" style={style} style:width="{radius * 2}px" style:height="{radius * 2}px" on:click={onClick}>
    <div class="xBar" style:width="100%" style:height="{thickness}px" style:background-color={color}></div>
    <div class="xBar" style:height="100%" style:width="{thickness}px" style:background-color={color}></div>
</button>

<style>
    .x {
        position: relative;
        display: inline-block;
        border: 0;
        padding: 0;
        margin: 0;
        background-color: transparent;
    }

    .x .xBar {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
    }
</style>

{#if rounded}
    <style>
        .x .xBar {
            border-radius: 100vmax;
        }
    </style>
{/if}
{#if onClick}
    <style>
        .x:hover {
            cursor: pointer;
        }
    </style>
{/if}