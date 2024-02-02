import {
  chunkalize,
  createCaption,
  createMediaGroup,
  randomGreeting,
} from "../src/utils/helpers";
import { bot } from "../src/bot";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { addShows, getUsersWithSeriesSub } from "../src/utils/database-service";
import { scrapeShows } from "../src/utils/scrapper-service";

export default async function handler(
  _request: VercelRequest,
  response: VercelResponse,
) {
  const users = await getUsersWithSeriesSub();
  if (!users)
    return response
      .status(200)
      .json({ error: false, message: "No users with series subs" });

  const shows = await scrapeShows({});
  await addShows({ shows });
  for (const user of users) {
    const results = user.custom
      ? await scrapeShows({ userId: user.userId })
      : shows;
    if (!results.length) continue;
    await bot.api.sendMessage(
      user.userId,
      `*${randomGreeting()} ${user.name}* You have *${
        results.length
      }* TV-Show updates`,
      {
        parse_mode: "Markdown",
      },
    );
    const chunks = chunkalize({ data: results });
    const mediaGroupPromises = chunks.map((chunk) => {
      const caption = createCaption({ chunk });
      const media = createMediaGroup({ chunk: chunk, caption: caption });
      return bot.api.sendMediaGroup(user.userId, media);
    });
    await Promise.all(mediaGroupPromises);
  }
  return response
    .status(200)
    .json({ error: false, message: "SUCCESS: shows sent." });
}
