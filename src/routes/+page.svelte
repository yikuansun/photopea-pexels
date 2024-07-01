<script>
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import Photopea from "$lib/photopea.mjs";

    let photos = [];
    let query = "";
    let morePages = false;
    let pagesRead = 0;
    let modalPhoto = {};
    let modalOpen = false;
    let exportSize = "medium";

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

    onMount(() => {
        getPhotos();
    });
</script>

<div id="topBar">
    <input id="searchBar" type="text" bind:value={query} placeholder="Search for photos" on:change={getPhotos} />
</div>

<div class="image-gallery">
    {#each photos as p}
        <li on:click={() => {
            modalPhoto = p;
            modalOpen = true;
        }}>
            <img src={p["src"]["medium"]} alt={p["alt"]} draggable={false} />
        </li>
    {/each}
</div>
{#if morePages}
    <button on:click={getMorePhotos}>Show More</button>
{/if}

{#if modalOpen}
    <div id="leModal">
        <button on:click={() => { modalOpen = false; }}>Close</button>
        <br /> <br />
        Photographer: <a target="_blank" href={modalPhoto["photographer_url"]}>{modalPhoto["photographer"]}</a>
        <br />
        <a target="_blank" href={modalPhoto["url"]}>
            <div id="modalPhoto" style:background-image="url('{modalPhoto["src"]["medium"]}')"></div>
        </a>
        <br />
        Size:
        <select bind:value={exportSize}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="original">Original Size</option>
        </select>
        <br />
        <button on:click={() => {
            Photopea.runScript(window.parent, `
                app.open("${modalPhoto["src"][exportSize]}", null, true);
            `);
        }}>
            Add to Document
        </button>
    </div>
{/if}

<style>
    .image-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 8px;
        margin-top: 0;
    }

    .image-gallery > li {
        height: 100px;
        position: relative;
        list-style-type: none;
        flex-grow: 1;
        cursor: pointer;
    }

    .image-gallery li img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        vertical-align: middle;
        user-select: none;
    }

    .image-gallery::after {
        content: "";
        flex-grow: 999;
    }

    #searchBar {
        width: 100%;
        box-sizing: border-box;
        padding: 5px;
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
    }
</style>