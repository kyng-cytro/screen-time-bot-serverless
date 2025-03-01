import { load } from "cheerio";
import { Followings, Movies, SearchResult, Shows } from "../types";
import {
  formatDate,
  generatePHPSESSID,  
  trimSummary,
} from "./helpers";

export const searchShows = async ({ show }: { show: string }) => {
  try {
    let results: SearchResult[] = [];
    const url = new URL("https://next-episode.net/search/");
    url.searchParams.append("name", show);
    const res = await fetch(url, { redirect: "manual" });
    const $ = load(await res.text());
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
      const showSummary = trimSummary({ summary: summary });

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

export const scrapeFollowings = async ({ userId }: { userId: number }) => {
  try {
    let followings: Followings = [];
    const login_info = {
      username: `screen_${userId}`,
      password: `screen_${userId}`,
    };
    const phpsessid = generatePHPSESSID({});
    let pageResponse = await fetch(`https://next-episode.net/userlogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: `PHPSESSID=${phpsessid};`,
      },
      body: new URLSearchParams(login_info),
    });
    pageResponse = await fetch(
      `https://next-episode.net/user/${login_info.username}/`,
      {
        headers: { Cookie: `PHPSESSID=${phpsessid};` },
      },
    );
    if (!pageResponse.ok) {
      console.error("Error grabbing shows");
      return followings;
    }
    const $ = load(await pageResponse.text());
    const items = $("div.item").toArray();
    if (!items.length) return followings;
    for (let item of items) {
      const header = $(item).find("span.headlinehref");
      if (!header.length) continue;
      const showId = header.find("a").attr("id")?.split("_")[1] || "";
      const showName = header.find("a").text();
      const data = {
        itemId: showId,
        name: showName,
      };
      followings.push(data);
    }
    return followings;
  } catch (err) {
    console.error(err);
    return [];
  }
};
export const scrapeShows = async ({ userId }: { userId?: number }) => {
  try {
    let shows: Shows = [];
    const login_info = {
      username: `screen_${userId}`,
      password: `screen_${userId}`,
    };
    const phpsessid = generatePHPSESSID({});
    let pageResponse = await fetch("https://next-episode.net/calendar/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: userId ? `PHPSESSID=${phpsessid};` : "",
      },
      body: new URLSearchParams(login_info),
    });

    if (userId) {
      pageResponse = await fetch("https://next-episode.net/calendar/", {
        headers: { Cookie: `PHPSESSID=${phpsessid};` },
      });
    }

    if (!pageResponse.ok) {
      console.error("Error grabbing shows");
      return shows;
    }
    const $ = load(await pageResponse.text());
    const todayShows = $("td.highlighteddayboxes2");
    if (!todayShows) return shows;
    const names = todayShows.find("a");
    for (const nameElement of names.toArray()) {
      const name = $(nameElement);
      if (!name.attr("title")) {
        continue;
      }
      const seriesName = name.attr("title") || "";
      const seriesLink = name.attr("href")?.replace("//", "https://") || "";
      const content = await fetch(seriesLink!);
      const contentHtml = await content.text();
      const content$ = load(contentHtml);
      const seriesImage = content$("#big_image").attr("src") || "";
      let episodeId: string | undefined;
      try {
        episodeId = content$("div.sub_main[id]").attr("id");
      } catch (error) {
        episodeId = undefined;
      }
      const seriesSummaryResponse = await fetch(
        `https://next-episode.net/PAGES/misc/episode_overview?id=${episodeId}`,
      );
      const seriesSummary = await seriesSummaryResponse.text();

      const data = {
        link: seriesLink,
        image: seriesImage,
        title: seriesName,
        summary: trimSummary({ summary: seriesSummary, chars: 150 }),
        date: formatDate({}),
      };
      shows.push(data);
    }
    return shows;
  } catch (err) {
    console.error("Error grabbing shows", err);
    return [];
  }
};

export const scrapeMovies = async () => {
  try {
    const movies: Movies = [];
    const url = new URL(
      "https://www.metacritic.com/browse/movies/release-date/theaters/date?view=detailed&ttype=1",
    );
    const pageResponse = await fetch(url);
    if (!pageResponse.ok) {
      console.error("Error grabbing movies");
      return movies;
    }
    const $ = load(await pageResponse.text());
    const movieItems = $("div.c-finderProductCard").toArray();
    for (const movieItem of movieItems) {
      const item = $(movieItem);
      if (!$(item).attr("class")) continue;
      const movieLink = `https://www.metacritic.com${item
        .find("a")
        .attr("href")}`;
      console.log(item)
      const movieImage = item.find("img").attr("src") || "https://placehold.co/600x400";
      const movieTitle = item.find("h3").text();
      const movieDate = item.find("span.c-finderProductCard_meta").text();
      const movieSummary = item
        .find("div.c-finderProductCard_description span")
        .text()
        .trim();
      const data = {
        link: movieLink,
        image: movieImage,
        title: movieTitle,
        date: formatDate({ date: movieDate }),
        summary: trimSummary({ summary: movieSummary, chars: 150 }),
      };
      movies.push(data);
    }
    return movies;
  } catch (err) {
    console.error("Error grabbing movies", err);
    return [];
  }
};
