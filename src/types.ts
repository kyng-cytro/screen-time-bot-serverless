import type { Context } from "grammy";

export interface GrammyContext extends Context {
  first_name?: string;
  user_name?: string;
  user_id?: number;
}
