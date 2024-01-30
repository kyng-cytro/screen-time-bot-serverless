import { load } from "cheerio";
import { SearchResult } from "../types";

export const searchShows = async ({ show }: { show: string }) => {
  try {
    let results: SearchResult[] = [];
    const url = new URL("https://next-episode.net/search/");
    url.searchParams.append("name", show);
    const res = await fetch(url);

    if (!res.ok) {
      console.error("Error looking up that show");
      return results;
    }

    const pageText = await res.text();

    const $ = load(pageText);

    const items = $("div.item").toArray();

    if (!items.length) return results;

    const limitedItems = items.slice(0, 3);

    for (let item of limitedItems) {
      const header = $(item).find("span.headlinehref");
      if (!header.length) continue;
      const showId = header.find("a").attr("id")?.split("_")[1] || "";
      const showImage = header.find("img").attr("src") || "";
      const showLink =
        header
          .find("a")
          .attr("href")
          ?.replace("/", "https://next-episode.net/") || "";
      const showName = header.find("a").text();
      const summary = $(item).find(".summary").text().replace("\n", "");
      const showSummary =
        summary.slice(0, 200) + (summary.length > 200 ? "..." : "");

      const data = {
        id: showId,
        title: showName,
        image: showImage,
        link: showLink,
        summary: showSummary,
      };
      results.push(data);
    }
    return results;
  } catch (err) {
    console.error("Error looking up that show:", err);
    return [];
  }
};
