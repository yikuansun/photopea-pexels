<script>
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import Photopea from "photopea";
    import { fly } from "svelte/transition";
    import X from "$lib/X.svelte";

    let photos = [];
    let query = "";
    let morePages = false;
    let pagesRead = 0;
    let modalPhoto = {};
    let modalOpen = false;
    let exportSize = "medium";
    let columns = 3;

    async function getPhotos() {
        let response = await fetch(base + "/api/search?q=" + query);
        let json = await response.json();
        photos = json["data"]["photos"];
        morePages = json["data"]["next_page"]?true:false;
        pagesRead = 1;
    }

    async function getMorePhotos() {
        let response = await fetch(base + "/api/search?q=" + query + "&page=" + (pagesRead + 1));
        let json = await response.json();
        photos = [...photos, ...json["data"]["photos"]];
        morePages = json["data"]["next_page"]?true:false;
        pagesRead++;
    }

    function getColumnCount() {
        let width = window.innerWidth;
        if (width < 250) columns = 1;
        else if (width < 360) columns = 2;
        else if (width < 490) columns = 3;
        else if (width < 640) columns = 4;
        else columns = 5;
    }

    onMount(() => {
        getPhotos();
        getColumnCount();
    });
</script>

<svelte:window on:load={getColumnCount} on:resize={getColumnCount} />

<div id="topBar">
    <input id="searchBar" type="text" bind:value={query} placeholder="Search for photos" on:change={getPhotos} />
</div>

<div class="image-gallery">
    {#each { length: columns } as _, columnIndex}
        <div class="column" style:width="{Math.floor(100 / columns)}%" style:padding-left={(columnIndex == 0)?"0":"8px"}>
            {#each photos.filter((p, i) => {
                return i % columns == columnIndex;
            }) as p, i}
                <a href={p["url"]} on:click={(e) => {
                    e.preventDefault();
                    modalPhoto = p;
                    modalOpen = true;
                }}>
                    <img src={p["src"]["medium"]} alt={p["alt"]} draggable={false} />
                </a>
            {/each}
        </div>
    {/each}
</div>
{#if morePages}
    <button on:click={getMorePhotos}
        style:margin="8px"
        style:margin-top={0}
        style:width="calc(100% - 16px)"
        style:box-sizing="border-box">Show More</button>
{/if}

{#if modalOpen}
    <div id="leModal" transition:fly={{ y: "100vh" }}>
        <X style="position: absolute; top: 8px; right: 8px;" onClick={() => { modalOpen = false; }} radius={12} thickness={3} />
        <table style:width="100%" style:height="100%">
            <tr style:height="0">
                <td>
                    Photographer: <a target="_blank" href={modalPhoto["photographer_url"]}>{modalPhoto["photographer"]}</a>
                </td>
            </tr>
            <tr>
                <td style:background-image="url('{modalPhoto["src"]["large"]}')"
                    style:background-size="contain" style:background-position="center"
                    style:background-repeat="no-repeat"></td>
            </tr>
            <tr style:height="0">
                <td>
                    <a target="_blank" href={modalPhoto["url"]}>View on Pexels</a>
                </td>
            </tr>
            <tr style:height="0">
                <td>
                    <label style:display="block"
                        style:text-align="center"
                        style:margin="7px">
                        Size:
                        <select bind:value={exportSize}>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                            <option value="large2x">Double Large</option>
                            <option value="original">Original Size</option>
                        </select>
                    </label>
                </td>
            </tr>
            <tr style:height="0">
                <td>
                    <button on:click={async () => {
                        let pea = new Photopea(window.parent);
                        let [ documentOpen, _ ] = await pea.runScript("app.echoToOE(app.documents.length > 0);");
                        await pea.openFromURL(modalPhoto["src"][exportSize], documentOpen);
                    }} style:width="100%"
                    style:box-sizing="border-box">
                        Add to Document
                    </button>
                </td>
            </tr>
        </table>
    </div>
{/if}

<style>
    .image-gallery {
        margin: 8px;
        margin-top: 0;
    }

    .column {
        display: inline-block;
        vertical-align: top;
        box-sizing: border-box;
        padding-left: 8px;
    }

    .image-gallery img {
        width: 100%;
        height: auto;
        display: block;
        margin-bottom: 8px;
    }

    #searchBar {
        width: 100%;
        box-sizing: border-box;
        padding: 5px;
        font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        outline: none!important;
        border-radius: 4px;
        border: 1px solid grey;
    }

    #topBar {
        position: sticky;
        top: 0; /* global body margin */
        background-color: white;
        padding: 8px;
        z-index: 5;
    }

    :global(body) {
        margin: 0;
        overflow-x: hidden;
    }

    #leModal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        box-sizing: border-box;
        padding: 10px;
        z-index: 6;
        background-color: white;
    }

    #modalPhoto {
        display: block;
        width: 100%;
        aspect-ratio: 1 / 1;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    :global(body) {
        background-color: white;
        font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }

    button {
        font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        background-color: #05a081;
        color: white;
        border: 0;
        padding: 8px 16px;
        border-radius: 5px;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: #059377;
        cursor: pointer;
    }

    a {
        color: #414141;
    }

     select {
        font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        border: 1px solid grey;
        border-radius: 4px;
        padding: 3px 5px;
        outline: none!important;

     }
</style>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
</svelte:head>