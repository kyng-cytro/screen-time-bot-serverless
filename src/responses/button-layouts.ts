import { Keyboard } from "grammy";

export const homeLayout = new Keyboard([
  [{ text: "📽 Movies Updates" }, { text: "🎬 TV-Shows Updates" }],
  [{ text: "ℹ️ Help" }],
]).resized();

export const seriesLayout = new Keyboard([
  [{ text: "Custom List Of Shows" }, { text: "Hottest TV-Shows Daily" }],
  [{ text: "🚫 Cancel" }],
])
  .resized()
  .oneTime();

export const removeLayout = new Keyboard();
