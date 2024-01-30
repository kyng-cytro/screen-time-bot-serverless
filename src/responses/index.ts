import { GrammyContext } from "../types";
import { subscribeUser } from "../utils/database-service";
import { randomGreeting } from "../utils/helpers";
import {
  createScreenTimeAccount,
  getScreenTimeAccountInfo,
} from "../utils/screen-time-service";
import { homeKeyboard, seriesKeyboard } from "./keyboards";
import { customSeriesButtons, moviesButtons, seriesButtons } from "./buttons";

export const moviesUpdateResponse = async (ctx: GrammyContext) => {
  return await ctx.reply(
    "Movie Updates are sent to our group weekly (Saturdays 10am W.A.T)",
    { reply_markup: moviesButtons },
  );
};

export const tvShowsUpdateResponse = async (ctx: GrammyContext) => {
  if (!ctx.user)
    return await ctx.reply(
      "You don't seem to be logged in try running /start.",
    );

  if (ctx.user.seriesSub)
    return await ctx.reply(
      `You currently have the *${
        ctx.user.custom ? "Custom List TV-Shows" : "Hottest TV-Shows Daily"
      }* subscription.`,
      {
        parse_mode: "Markdown",
        reply_markup: ctx.user.custom ? customSeriesButtons : seriesButtons,
      },
    );

  return await ctx.reply("Alright Please Select A Subscription Type.", {
    reply_markup: seriesKeyboard,
  });
};

export const hottestTvShowsDailyResponse = async (ctx: GrammyContext) => {
  if (!ctx.user)
    return await ctx.reply(
      "You don't seem to be logged in try running /start.",
    );

  await subscribeUser({ id: ctx.user?.id, type: "reg" });
  return await ctx.reply(
    "✅ Done. You will now get daily updates on the latest and hottest episodes",
    { reply_markup: homeKeyboard },
  );
};

export const customListOfShowsResponse = async (ctx: GrammyContext) => {
  if (!ctx.user)
    return await ctx.reply(
      "You don't seem to be logged in try running /start.",
    );

  if (ctx.user.account) {
    await subscribeUser({
      type: "custom",
      id: ctx.user.id,
      accountId: ctx.user.account.accountId,
      kValue: ctx.user.account.kValue,
    });
    return await ctx.reply(
      "🤔 Seems like you've once had a Custom List Of Shows subscription. We will be using that.\n\nRemember you can use /search <name of tv-show> to search shows to follow",
      { reply_markup: homeKeyboard },
    );
  }

  const { account_id, k_value } = await getScreenTimeAccountInfo({
    userId: ctx.user.userId,
  });

  if (account_id && k_value) {
    await subscribeUser({
      id: ctx.user.id,
      type: "custom",
      accountId: account_id,
      kValue: k_value,
    });

    return await ctx.reply(
      "🤔 Seems like you've once had a Custom List Of Shows subscription. We will be using that.\n\nRemember you can use /search <name of tv-show> to search shows to follow",
      {
        reply_markup: homeKeyboard,
      },
    );
  }

  const { account_id: new_account_id, k_value: new_k_value } =
    await createScreenTimeAccount({ userId: ctx.user.userId });

  if (!new_account_id || !new_k_value)
    return await ctx.reply(
      "😔 Something went wrong setting up your account. Please use /start to restart the bot and try again",
      {
        reply_markup: { remove_keyboard: true },
      },
    );

  await subscribeUser({
    id: ctx.user.id,
    type: "custom",
    accountId: new_account_id,
    kValue: new_k_value,
  });

  return await ctx.reply(
    "✅ Done. Use '/search <name of tv-show>' to search shows to follow.",
    { reply_markup: homeKeyboard },
  );
};

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
