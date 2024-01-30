import { GROUP_ID } from "../constants";
import { GrammyContext } from "../types";

export const pingCallBack = async (ctx: GrammyContext) => {
  if (ctx.user?.role !== "admin") return await ctx.reply("😂 Lol you wish.");
  const msg = await ctx.reply("Sending...");
  await ctx.api.sendMessage(GROUP_ID!, "Up & Running");
  return await msg.editText("Sent successfully");
};
