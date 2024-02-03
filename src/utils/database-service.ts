import { Movies, Shows } from "../types";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export const getUser = async ({ userId }: { userId: number }) => {
  try {
    return await prisma.user.findUnique({
      where: { userId },
      include: { account: true },
    });
  } catch (err) {
    console.error(err);
  }
};

export const getUsers = async () => {
  try {
    return await prisma.user.findMany({ cacheStrategy: { ttl: 60 } });
  } catch (err) {
    console.error(err);
  }
};

export const getUsersWithSeriesSub = async () => {
  try {
    return await prisma.user.findMany({
      where: { seriesSub: true },
    });
  } catch (err) {
    console.error(err);
  }
};

export const getMovies = async () => {
  try {
    return await prisma.movie.findMany({ cacheStrategy: { ttl: 60 } });
  } catch (err) {
    console.error(err);
  }
};

export const getShows = async () => {
  try {
    return await prisma.show.findMany({ cacheStrategy: { ttl: 60 } });
  } catch (err) {
    console.error(err);
  }
};

export const addUser = async ({
  userId,
  name,
}: {
  userId: number;
  name: string;
}) => {
  try {
    return await prisma.user.create({
      data: { userId, name },
    });
  } catch (err) {
    console.error(err);
  }
};

export const addMovies = async ({ movies }: { movies: Movies }) => {
  try {
    return await prisma.$transaction([
      prisma.movie.deleteMany({}),
      prisma.movie.createMany({ data: movies, skipDuplicates: true }),
    ]);
  } catch (err) {
    console.error(err);
  }
};

export const addShows = async ({ shows }: { shows: Shows }) => {
  try {
    return await prisma.$transaction([
      prisma.show.deleteMany({}),
      prisma.show.createMany({ data: shows, skipDuplicates: true }),
    ]);
  } catch (err) {
    console.error(err);
  }
};

export const subscribeUser = async (
  props:
    | { type: "reg"; id: string }
    | { id: string; type: "custom"; accountId: string; kValue: string },
) => {
  try {
    if (props.type === "reg") {
      return await prisma.user.update({
        where: { id: props.id },
        data: {
          seriesSub: true,
        },
      });
    }

    return await prisma.user.update({
      where: { id: props.id },
      data: {
        seriesSub: true,
        custom: true,
        account: {
          upsert: {
            create: {
              accountId: props.accountId,
              kValue: props.kValue,
            },
            update: {},
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export const unSubscribeUser = async ({ id }: { id: string }) => {
  try {
    return await prisma.user.update({
      where: { id },
      data: { seriesSub: false, custom: false },
    });
  } catch (err) {
    console.error(err);
  }
};

export const getUserFollowings = async ({ id }: { id: string }) => {
  try {
    return await prisma.followingItem.findMany({
      where: { users: { some: { id } } },
    });
  } catch (err) {
    console.error(err);
  }
};

export const addToFollowings = async ({
  id,
  showId,
  showName,
}: {
  id: string;
  showId: string;
  showName: string;
}) => {
  try {
    return await prisma.user.update({
      where: { id },
      data: {
        following: {
          connectOrCreate: {
            where: { itemId: showId },
            create: { itemId: showId, name: showName },
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export const removeFromFollowings = async ({
  id,
  showId,
}: {
  id: string;
  showId: string;
}) => {
  try {
    return await prisma.user.update({
      where: { id },
      data: {
        following: {
          delete: { itemId: showId },
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export const checkIfUserIsFollowing = async ({
  id,
  showId,
}: {
  id: string;
  showId: string;
}) => {
  try {
    await prisma.followingItem.findFirstOrThrow({
      where: { itemId: showId, users: { some: { id } } },
    });
    return true;
  } catch (err) {
    return false;
  }
};
