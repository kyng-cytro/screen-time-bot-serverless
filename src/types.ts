import type { Context } from "grammy";
import type { Movie, Prisma, Show } from "../prisma/generated/client";

export interface GrammyContext extends Context {
  first_name?: string;
  user_name?: string;
  user_id?: number;
  user?: BotUser;
}

export type BotUser = Prisma.UserGetPayload<{ include: { account: true } }>;

export type Movies = Movie[];

export type Shows = Show[];
