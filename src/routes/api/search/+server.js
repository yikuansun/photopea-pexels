import { PEXELS_API_KEY } from "$env/static/private";
import { createClient } from "pexels";
import { json } from "@sveltejs/kit";

let client = createClient(PEXELS_API_KEY);

export async function GET({ url }) {
    let query = url.searchParams.get("q");
    let page = url.searchParams.get("page") || 1;

    let results;
    if (query) {
        results = await client.photos.search({
            query: query,
            per_page: 50,
            page: page,
        });
    }
    else {
        results = await client.photos.curated({
            per_page: 50,
            page: page,
        });
    }
    return json({
        message: "success",
        data: results,
    });
};