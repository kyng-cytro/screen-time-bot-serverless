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
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).end("Unauthorized");
  }

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
    // NOTE: can't use paralle cause of ratelimit
    for (const chunk of chunks) {
      const caption = createCaption({ chunk });
      const media = createMediaGroup({ chunk: chunk, caption: caption });
      await bot.api.sendMediaGroup(user.userId, media);
    }
  }
  return response
    .status(200)
    .json({ error: false, message: "SUCCESS: shows sent." });
}
