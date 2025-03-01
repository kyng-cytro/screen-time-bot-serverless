import {
  chunkalize,
  createCaption,
  createMediaGroup,
} from "../src/utils/helpers";
import { bot } from "../src/bot";
import { GROUP_ID } from "../src/constants";
import { addMovies } from "../src/utils/database-service";
import { scrapeMovies } from "../src/utils/scrapper-service";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).end("Unauthorized");
  }
  const movies = await scrapeMovies();
  if (!movies.length)
    return response
      .status(200)
      .json({ error: false, message: "No movies data to act upon." });
  await addMovies({ movies });
  const chunks = chunkalize({ data: movies });
  // NOTE: can't use paralle cause of ratelimit
  for (const chunk of chunks) {
    const caption = createCaption({ chunk });
    const media = createMediaGroup({ chunk: chunk, caption: caption });
    await bot.api.sendMediaGroup(GROUP_ID, media);
  }
  return response
    .status(200)
    .json({ error: false, message: "SUCCESS: movies sent." });
}
