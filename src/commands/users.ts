import { GrammyContext } from "../types";
import { getUsers } from "../utils/database";

export const usersCallBack = async (ctx: GrammyContext) => {
  if (ctx.user?.role !== "admin") return await ctx.reply("😂 Lol you wish.");
  const msg = await ctx.reply("Grabbing all users...");
  const users = await getUsers();

  const format = users
    ?.map((user) => `*${user.name}*: ${user.userId}`)
    .join("\n");

  return await msg.editText(`*All Users*: ${users?.length}\n${format}`, {
    parse_mode: "Markdown",
  });
};
