<script>
    import { base } from "$app/paths";
    import { onMount } from "svelte";

    let photos = [];
    let query = "";
    let morePages = false;
    let pagesRead = 0;

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

<div class="image-gallery">
    {#each photos as p}
        <li>
            <img src={p["src"]["medium"]} alt={p["alt"]} draggable={false} />
        </li>
    {/each}
</div>
{#if morePages}
    <button on:click={getMorePhotos}>Show More</button>
{/if}

<style>
    .image-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .image-gallery > li {
        height: 100px;
        position: relative;
        list-style-type: none;
        flex-grow: 1;
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
</style>