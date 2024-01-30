import { InlineKeyboard } from "grammy";

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
