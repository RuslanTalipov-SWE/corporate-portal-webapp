"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const signUp = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return "Пользователь с таким email уже существует";
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  return "Пользователь успешно зарегистрирован";
};
