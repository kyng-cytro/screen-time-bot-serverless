import type { Context } from "grammy";
import { HydrateFlavor } from "@grammyjs/hydrate";
import type { Prisma, Show } from "@prisma/client";

export interface GrammyContext extends HydrateFlavor<Context> {
  first_name?: string;
  user_name?: string;
  user_id?: number;
  user?: BotUser;
}

export type Movies = CreateMovie[];
export type Shows = CreateShow[];
export type CreateMovie = Prisma.MovieCreateInput;
export type CreateShow = Prisma.ShowCreateInput;
export type SearchResult = Omit<Show, "date" | "createdAt" | "updatedAt">;
export type BotUser = Prisma.UserGetPayload<{ include: { account: true } }>;
