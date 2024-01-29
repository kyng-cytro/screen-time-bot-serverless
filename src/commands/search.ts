import { homeLayout } from "../responses/button-layouts";
import { searchResultKeyboard } from "../responses/inline-keyboards";
import { GrammyContext } from "../types";

export const searchCallBack = async (ctx: GrammyContext) => {
  const query = ctx.match;

  if (!query)
    return await ctx.reply(
      "🤔 You didn't pass in a valid TV-Show (search <name of tv-show>)",
      { reply_markup: homeLayout },
    );

  const msg = await ctx.reply("⌛ Hold on we are fetching results...", {
    reply_parameters: { message_id: ctx.message?.message_id! },
  });

  // TODO: get real data from scrape
  const results = [
    {
      show_id: "",
      image:
        "https://earlystemer.com/wp-content/uploads/2021/07/earlystemer-logo-120x46.png",
      name: "test",
      summary: "test",
      link: "wdw",
    },
  ];

  if (!results.length)
    return await ctx.api.editMessageText(
      ctx.user_id!,
      msg.message_id,
      `No Shows found for the name *${query}*`,
      { parse_mode: "Markdown" },
    );

  await ctx.api.editMessageText(
    ctx.user_id!,
    msg.message_id,
    `Here are the top ${results.length} results for *${query}*`,
    { parse_mode: "Markdown" },
  );

  for (const item of results) {
    await ctx.replyWithPhoto(item.image, {
      caption: `*${item.name}*\n\n${item.summary}\n\n[👀 Read More](${item.link})`,
      parse_mode: "Markdown",
      reply_markup: searchResultKeyboard(item.show_id),
    });
  }
};
