import { homeKeyboard } from "../responses/keyboards";
import { GrammyContext } from "../types";
import { addUser } from "../utils/database-service";
import { randomGreeting } from "../utils/helpers";

export const startCallBack = async (ctx: GrammyContext) => {
  if (ctx.user)
    return await ctx.reply(
      `*${randomGreeting()} ${ctx.first_name}* Welcome back to Screen Time 🍿`,
      {
        parse_mode: "Markdown",
        reply_markup: homeKeyboard,
      },
    );

  await addUser({ userId: ctx.user_id!, name: ctx.first_name! });

  return await ctx.reply(
    `*${randomGreeting()} ${ctx.first_name}* Welcome to Screen Time 🍿`,
    {
      parse_mode: "Markdown",
      reply_markup: homeKeyboard,
    },
  );
};
