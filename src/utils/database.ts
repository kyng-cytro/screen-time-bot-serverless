import { PrismaClient } from "../../prisma/generated/client/";

const prisma = new PrismaClient();

export const getUser = async ({ userId }: { userId: number }) => {
  try {
    return await prisma.user.findUnique({
      where: { userId },
    });
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

// TODO: implement rest of db functions
