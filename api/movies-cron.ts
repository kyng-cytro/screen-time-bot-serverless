import {
  chunkalize,
  createCaption,
  createMediaGroup,
} from "../src/utils/helpers";
import { bot } from "../src/bot";
import { GROUP_ID } from "../src/constants";
import { addMovies } from "../src/utils/database-service";
import { getMovies } from "../src/utils/scrapper-service";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  _request: VercelRequest,
  response: VercelResponse,
) {
  const movies = await getMovies();
  if (!movies.length)
    return response
      .status(200)
      .json({ error: false, message: "No movies data to act upon." });
  await addMovies({ movies });
  const chunks = chunkalize({ data: movies });
  const mediaGroupPromises = chunks.map((chunk) => {
    const caption = createCaption({ chunk });
    const media = createMediaGroup({ chunk: chunk, caption: caption });
    return bot.api.sendMediaGroup(GROUP_ID, media);
  });
  await Promise.all(mediaGroupPromises);
  return response
    .status(200)
    .json({ error: false, message: "SUCCESS: movies sent." });
}
