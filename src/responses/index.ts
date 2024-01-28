import { GrammyContext } from "../types";
import { randomGreeting } from "../utils/helpers";
import { homeLayout } from "./button-layouts";
import { moviesKeyboard } from "./inline-keyboards";

export const moviesUpdateResponse = async (ctx: GrammyContext) => {
  return await ctx.reply(
    "Movie Updates are sent to our group weekly (Saturdays 10am W.A.T)",
    { reply_markup: moviesKeyboard },
  );
};

export const cancelResponse = async (ctx: GrammyContext) => {
  return await ctx.reply("🍿 Main Menu", {
    reply_markup: homeLayout,
  });
};

export const greetingResponse = async (ctx: GrammyContext) => {
  return ctx.reply(`*${randomGreeting()} ${ctx.first_name}*`, {
    parse_mode: "Markdown",
    reply_markup: homeLayout,
  });
};
