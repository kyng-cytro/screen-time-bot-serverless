import { homeKeyboard } from "../responses/keyboards";
import { searchResultButton } from "../responses/buttons";
import { GrammyContext } from "../types";
import { searchShows } from "../utils/scrapper-service";

export const searchCallBack = async (ctx: GrammyContext) => {
  const query = ctx.match;

  if (!query)
    return await ctx.reply(
      "🤔 You didn't pass in a valid TV-Show (search <name of tv-show>)",
      { reply_markup: homeKeyboard },
    );

  const msg = await ctx.reply("⌛ Hold on we are fetching results...", {
    reply_parameters: { message_id: ctx.message?.message_id! },
  });

  const results = await searchShows({ show: query.toString() });

  if (!results.length)
    return await msg.editText(`No Shows found for the name *${query}*`, {
      parse_mode: "Markdown",
    });

  await msg.editText(
    `Here are the top ${results.length} results for *${query}*`,
    { parse_mode: "Markdown" },
  );

  for (const item of results) {
    if (!item.id) continue;
    await ctx.replyWithPhoto(item.image, {
      caption: `*${item.title}*\n\n${item.summary}\n\n[👀 Read More](${item.link})`,
      parse_mode: "Markdown",
      reply_markup: searchResultButton(item.id),
    });
  }
};
