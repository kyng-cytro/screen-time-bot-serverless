import type { Context } from "grammy";
import { HydrateFlavor } from "@grammyjs/hydrate";
import type { Movie, Prisma, Show } from "@prisma/client";

export interface GrammyContext extends HydrateFlavor<Context> {
  first_name?: string;
  user_name?: string;
  user_id?: number;
  user?: BotUser;
}

export type BotUser = Prisma.UserGetPayload<{ include: { account: true } }>;

export type Movies = Movie[];

export type Shows = Show[];

export type SearchResult = Omit<Show, "date" | "createdAt" | "updatedAt">;
