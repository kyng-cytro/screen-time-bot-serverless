import type { Context } from "grammy";
import type { User } from "../prisma/generated/client";

export interface GrammyContext extends Context {
  first_name?: string;
  user_name?: string;
  user_id?: number;
  user?: User | null;
}
