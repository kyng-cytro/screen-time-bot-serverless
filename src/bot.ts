import "dotenv/config";
import { Bot } from "grammy";
import { BOT_TOKEN, ENV, GREETINGS } from "./constants";
import { GrammyContext } from "./types";
import { helpCallBack } from "./commands/help";
import { pingCallBack } from "./commands/ping";
import { searchCallBack } from "./commands/search";
import { startCallBack } from "./commands/start";
import { updateContext } from "./middlewares";
import {
  moviesUpdateResponse,
  cancelResponse,
  greetingResponse,
  tvShowsUpdateResponse,
  hottestTvShowsDailyResponse,
  customListOfShowsResponse,
} from "./responses";

export const bot = new Bot<GrammyContext>(BOT_TOKEN);

bot.use(updateContext);

bot.command("help", helpCallBack);

bot.command("ping", pingCallBack);

bot.command("start", startCallBack);

bot.command("search", searchCallBack);

bot.on("msg:text", async (ctx) => {
  const message = ctx.msg.text;

  if (message === "📽 Movies Updates") return await moviesUpdateResponse(ctx);

  if (message === "🎬 TV-Shows Updates")
    return await tvShowsUpdateResponse(ctx);

  if (message === "Hottest TV-Shows Daily")
    return await hottestTvShowsDailyResponse(ctx);

  if (message === "Custom List Of Shows")
    return await customListOfShowsResponse(ctx);

  if (message === "🚫 Cancel") return await cancelResponse(ctx);

  if (message === "ℹ️ Help") return await helpCallBack(ctx);

  if (GREETINGS.some((substring) => message.toLowerCase().includes(substring)))
    return await greetingResponse(ctx);

  ctx.reply("Hmm... 🤔 I don't quite understand what you mean.");
});

if (ENV === "development") {
  bot.start();
}
