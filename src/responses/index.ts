import { GrammyContext } from "../types";
import { randomGreeting } from "../utils/helpers";
import { homeKeyboard } from "./keyboards";

export const cancelResponse = async (ctx: GrammyContext) => {
  return await ctx.reply("🍿 Main Menu", {
    reply_markup: homeKeyboard,
  });
};

export const greetingResponse = async (ctx: GrammyContext) => {
  return ctx.reply(`*${randomGreeting()} ${ctx.first_name}*`, {
    parse_mode: "Markdown",
    reply_markup: homeKeyboard,
  });
};
