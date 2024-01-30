import { Keyboard } from "grammy";

export const homeKeyboard = new Keyboard()
  .text("📽 Movies Updates")
  .text("🎬 TV-Shows Updates")
  .row()
  .text("ℹ️  Help")
  .resized();

export const seriesKeyboard = new Keyboard()
  .text("Custom List Of Shows")
  .text("Hottest TV-Shows Daily")
  .row()
  .text("🚫 Cancel")
  .resized()
  .oneTime();
