import { fetchAPI } from "@/lib/fetch-api";

const baseUrl = "http://localhost:1337";
const url = new URL(`${baseUrl}/api/posts`);

export async function createContentService(payload: any) {
  try {
    const response = await fetchAPI(url.href, {
      method: "POST",
      payload,
    });

    if (!response.ok) throw new Error("Failed to add content");
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error(error);
    throw Error("Failed add content");
  }
}
