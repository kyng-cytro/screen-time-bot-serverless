import { GrammyContext } from "../types";

export const helpCallBack = async (ctx: GrammyContext) => {
  await ctx.reply(
    "This bot Sends Daily Or Weekly Updates On The Latest Movies And Shows.\n\nHere are some commands to help.\n\n/start - Start or Restart the bot\n/help - Get Info and Help\n/search <name of tv-show> - Search for tv-shows to follow",
  );
};
