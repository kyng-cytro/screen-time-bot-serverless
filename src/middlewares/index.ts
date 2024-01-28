import { GrammyContext } from "../types";

export const updateContext = (ctx: GrammyContext, next: any) => {
  ctx.first_name = ctx.from?.first_name;
  ctx.user_name = ctx.from?.username;
  ctx.user_id = ctx.from?.id;
  return next();
};
