import { GROUP_ID } from "../constants";
import { GrammyContext } from "../types";

export const pingCallBack = async (ctx: GrammyContext) => {
  ctx.api.sendMessage(GROUP_ID!, "Up & Running");
};
