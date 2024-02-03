import { InlineKeyboard } from "grammy";
import { GrammyContext, Shows } from "../types";
import {
  addToFollowings,
  checkIfUserIsFollowing,
  getMovies,
  getShows,
  getUserFollowings,
  removeFromFollowings,
  unSubscribeUser,
} from "../utils/database-service";
import { scrapeShows } from "../utils/scrapper-service";
import { toggleScreenTimeWatchList } from "../utils/screen-time-service";
import { chunkalize, createCaption, createMediaGroup } from "../utils/helpers";
import { FollowingItem } from "@prisma/client";

export const seriesButtons = new InlineKeyboard()
  .add({
    text: "🎬 Today's Episodes",
    callback_data: "show_today",
  })
  .add({ text: "🚫 Cancel Subscription", callback_data: "show_cancel" });

export const moviesButtons = new InlineKeyboard().add({
  text: "📽 Missed Last List",
  callback_data: "show_last",
});

export const cancelSubButtons = new InlineKeyboard()
  .add({ text: "✅ Yes", callback_data: "cancel_sub" })
  .add({ text: "❌ No", callback_data: "no_cancel_sub" });

export const customSeriesButtons = new InlineKeyboard()
  .add({ text: "🎬 Today's Episodes", callback_data: "show_today" })
  .add({ text: "🚫 Cancel Subscription", callback_data: "show_cancel" })
  .row()
  .add({ text: "ℹ️ Details", callback_data: "show_sub_details" });

export const searchResultButton = (id: string) => {
  return new InlineKeyboard().add({
    text: "➕ Add To Custom List",
    callback_data: `add_${id}`,
  });
};

const subDetailsButtons = ({ chunks }: { chunks: FollowingItem[][] }) => {
  const button = new InlineKeyboard();
  chunks.forEach((chunk, rowIndex) => {
    chunk.forEach((item, cellIndex) => {
      button.add({
        text: `🚫 ${cellIndex + 1 + rowIndex * 3}`,
        callback_data: `remove_${item.itemId}`,
      });
    });
  });
  button.row().add({ text: "✅ Done", callback_data: "done_with_details" });
  return button;
};

const callBackAnswer = (message: string, data: string) => {
  return new InlineKeyboard().add({
    text: message,
    callback_data: data,
  });
};

const answerCallBack = async ({
  ctx,
  message = "",
  error = false,
}: {
  ctx: GrammyContext;
  message?: string;
  error?: boolean;
}) => {
  await ctx.callbackQuery?.answer();
  const finalMessage = error
    ? `❌ Error ${message ? `: ${message}` : ""}`
    : `✅ ${message}`;
  await ctx.editMessageReplyMarkup({
    reply_markup: callBackAnswer(finalMessage, "done"),
  });
};

export const showCancelCallBack = async (ctx: GrammyContext) => {
  if (!ctx.user)
    return await answerCallBack({
      ctx,
      error: true,
      message: "Not loggedin. try /start",
    });
  if (!ctx.user.seriesSub)
    return await answerCallBack({
      ctx,
      error: true,
      message: "You don't have an active subscription",
    });
  await ctx.callbackQuery?.answer();
  return await ctx.editMessageText(
    `Do you really want to cancel your *${
      ctx.user.custom ? "custom list of shows" : "hottest tv-shows daily"
    }* subscription?`,
    {
      parse_mode: "Markdown",
      reply_markup: cancelSubButtons,
    },
  );
};

export const showSubDetailsCallBack = async (ctx: GrammyContext) => {
  if (!ctx.user)
    return await answerCallBack({
      ctx,
      error: true,
      message: "Not loggedin. try /start",
    });

  if (!ctx.user.seriesSub)
    return await answerCallBack({
      ctx,
      error: true,
      message: "You need an active series subscription",
    });

  await ctx.callbackQuery?.answer();
  await ctx.editMessageText("⌛ Getting subscription details...");
  const shows = await getUserFollowings({ id: ctx.user.id });
  if (!shows || !shows.length)
    return ctx.editMessageText(
      `*Subscription Details*\nSubscription Type: Custom List Of TV-Shows\nNumber Of Shows: None`,
      { parse_mode: "Markdown" },
    );

  const chunks = chunkalize({ data: shows, chunkSize: 3 });

  return await ctx.editMessageText(
    `*Subscription Details*\nSubscription Type: Custom List Of TV-Shows\nNumber Of Shows: ${
      shows.length
    }\n\n*Names Of Shows*\n${shows
      .map((show, num) => `${num + 1}. ${show.name}`)
      .join("\n")}`,
    { parse_mode: "Markdown", reply_markup: subDetailsButtons({ chunks }) },
  );
};

export const showTodayCallBack = async (ctx: GrammyContext) => {
  if (!ctx.user)
    return await answerCallBack({
      ctx,
      error: true,
      message: "Not loggedin. try /start",
    });

  if (!ctx.user.seriesSub)
    return await answerCallBack({
      ctx,
      error: true,
      message: "You need an active series subscription",
    });

  await ctx.callbackQuery?.answer();
  await ctx.editMessageText("⌛ Getting today's updates...");

  let shows: Shows | undefined = [];

  if (ctx.user.custom) {
    shows = await scrapeShows({ userId: ctx.user.userId });
  } else {
    shows = await getShows();
  }

  if (!shows || !shows.length)
    return await ctx.editMessageText(
      "😞 There are no TV-Shows updates for you today.",
    );
  const chunks = chunkalize({ data: shows });
  // NOTE: can't use paralle cause of ratelimit
  for (const chunk of chunks) {
    const caption = createCaption({ chunk });
    const media = createMediaGroup({ chunk: chunk, caption: caption });
    await ctx.api.sendMediaGroup(ctx.user.userId, media);
  }
};

export const showLastCallBack = async (ctx: GrammyContext) => {
  if (!ctx.user)
    return await answerCallBack({
      ctx,
      error: true,
      message: "Not loggedin. try /start",
    });
  await ctx.callbackQuery?.answer();
  await ctx.editMessageText("⌛ Getting last movies update...");
  const movies = await getMovies();
  if (!movies || !movies.length)
    return await ctx.editMessageText("😞 There are no Movie updates to show.");
  const chunks = chunkalize({ data: movies });
  // NOTE: can't use paralle cause of ratelimit
  for (const chunk of chunks) {
    const caption = createCaption({ chunk });
    const media = createMediaGroup({ chunk: chunk, caption: caption });
    await ctx.api.sendMediaGroup(ctx.user.userId, media);
  }
};

export const cancelSubCallBack = async (ctx: GrammyContext) => {
  if (!ctx.user)
    return await answerCallBack({
      ctx,
      error: true,
      message: "Not loggedin. try /start",
    });
  if (!ctx.user.seriesSub)
    return await answerCallBack({
      ctx,
      error: true,
      message: "You need an active series subscription",
    });
  await unSubscribeUser({ id: ctx.user.id });
  return await answerCallBack({
    ctx,
    message: "Subscription canceled successfully.",
  });
};

export const noCancelSubCallBack = async (ctx: GrammyContext) => {
  await ctx.callbackQuery?.answer();
  return await ctx.editMessageText("🍿 Main Menu");
};

export const doneWithDetailsCallback = async (ctx: GrammyContext) => {
  await ctx.callbackQuery?.answer();
  return await ctx.editMessageText("🍿 Main Menu");
};

export const addFavouriteCallBack = async (ctx: GrammyContext) => {
  if (!ctx.user)
    return await answerCallBack({
      ctx,
      error: true,
      message: "Not loggedin. try /start",
    });
  if (!ctx.user.custom)
    return await answerCallBack({
      ctx,
      error: true,
      message: "You need an active custom list subscription",
    });
  const showId = ctx.callbackQuery?.data?.split("_")[1];
  const showName = ctx.callbackQuery?.message?.caption?.split("\n\n")[0];
  if (!showId || !showName) return await answerCallBack({ ctx, error: true });
  if (await checkIfUserIsFollowing({ id: ctx.user.id, showId })) {
    return await answerCallBack({ ctx, message: "Already Following" });
  }
  if (!ctx.user.account)
    return await answerCallBack({
      ctx,
      error: true,
      message: "Try resubscribing to custom list",
    });
  await toggleScreenTimeWatchList({
    showId,
    accountId: ctx.user.account.accountId,
    kValue: ctx.user.account.kValue,
  });
  await addToFollowings({ id: ctx.user.id, showId, showName });
  return await answerCallBack({ ctx, message: "Successful" });
};

export const removeFavouriteCallBack = async (ctx: GrammyContext) => {
  if (!ctx.user)
    return await answerCallBack({
      ctx,
      error: true,
      message: "Not loggedin. try /start",
    });
  if (!ctx.user.custom)
    return await answerCallBack({
      ctx,
      error: true,
      message: "You need an active custom list subscription",
    });

  const showId = ctx.callbackQuery?.data?.split("_")[1];
  if (!showId) return await answerCallBack({ ctx, error: true });
  if (await checkIfUserIsFollowing({ id: ctx.user.id, showId })) {
    if (!ctx.user.account)
      return await answerCallBack({
        ctx,
        error: true,
        message: "Try resubscribing to custom list",
      });
    await toggleScreenTimeWatchList({
      showId,
      accountId: ctx.user.account.accountId,
      kValue: ctx.user.account.kValue,
    });
    await removeFromFollowings({ id: ctx.user.id, showId });
  }
  const shows = await getUserFollowings({ id: ctx.user.id });
  if (!shows || !shows.length)
    return ctx.editMessageText(
      `*Subscription Details*\nSubscription Type: Custom List Of TV-Shows\nNumber Of Shows: None`,
      { parse_mode: "Markdown" },
    );
  const chunks = chunkalize({ data: shows, chunkSize: 3 });
  return await ctx.editMessageText(
    `*Subscription Details*\nSubscription Type: Custom List Of TV-Shows\nNumber Of Shows: ${
      shows.length
    }\n\n*Names Of Shows*\n${shows
      .map((show, num) => `${num + 1}. ${show.name}`)
      .join("\n")}`,
    { parse_mode: "Markdown", reply_markup: subDetailsButtons({ chunks }) },
  );
};
