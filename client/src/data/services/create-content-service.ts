import { fetchAPI } from "@/lib/fetch-api";

const baseUrl = "http://localhost:1337";
const url = new URL(`${baseUrl}/api/posts`);

export async function createContentService(payload: any) {
    const data = await fetchAPI(url.href, {
      method: "POST",
      payload,
    });

    return data;
}
