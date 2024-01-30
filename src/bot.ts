import "dotenv/config";
import { Bot } from "grammy";
import { hydrate } from "@grammyjs/hydrate";
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

bot.use(hydrate());

bot.use(updateContext);

bot.command("help", helpCallBack);

bot.command("ping", pingCallBack);

bot.command("start", startCallBack);

bot.command("search", searchCallBack);

bot.hears("📽 Movies Updates", moviesUpdateResponse);

bot.hears("🎬 TV-Shows Updates", tvShowsUpdateResponse);

bot.hears("Hottest TV-Shows Daily", hottestTvShowsDailyResponse);

bot.hears("Custom List Of Shows", customListOfShowsResponse);

bot.hears("🚫 Cancel", cancelResponse);

bot.hears("ℹ️  Help", helpCallBack);

bot.on("msg:text", async (ctx) => {
  const message = ctx.msg.text;

  if (GREETINGS.some((substring) => message.toLowerCase().includes(substring)))
    return await greetingResponse(ctx);

  ctx.reply("Hmm... 🤔 I don't quite understand what you mean.");
});

if (ENV === "development") {
  bot.start();
}
