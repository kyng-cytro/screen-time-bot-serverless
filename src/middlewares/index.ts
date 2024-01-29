import { GrammyContext } from "../types";
import { getUser } from "../utils/database";

export const updateContext = async (ctx: GrammyContext, next: any) => {
  ctx.first_name = ctx.from?.first_name;
  ctx.user_name = ctx.from?.username;
  ctx.user_id = ctx.from?.id;
  ctx.user = await getUser({ userId: ctx.user_id! });
  return next();
};
