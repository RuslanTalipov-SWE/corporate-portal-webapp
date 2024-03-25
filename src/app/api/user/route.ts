import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";

// Define a schema for validation

const userSchema = z.object({
  username: z.string().min(1, "Введите имя").max(100),
  email: z.string().min(1, "Введите email").email("Неверный формат email"),
  password: z
    .string()
    .min(1, "Введите пароль")
    .min(8, "ароль должен сожержать не менее 8 символов"),
});

export async function POST(req: Request) {
  try {
    // Парсинг и валидация входных данных с помощью Zod
    const body = await req.json();
    const { email, username, password } = userSchema.parse(body);

    // check if email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          message: "Пользователь с таким email уже существует",
        },
        { status: 409 }
      );
    }

    // check if username already exists
    const existingUserByUsername = await db.user.findUnique({
      where: { username: username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        {
          user: null,
          message: "Пользователь с таким именем уже существует",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      {
        user: newUser,
        message: "Пользователь успешно зарегистрирован",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error({
      timestamp: new Date().toISOString(),
      file: "src/app/api/user/route.ts",
      action: "Создать пользователя",
      errorMessage:
        error instanceof Error ? error.message : "Неизвестная ошибка",
      stackTrace:
        error instanceof Error ? error.stack : "Трассировка стека не получена",
    });
    return NextResponse.json(
      {
        message: "Что-то пошло не так",
      },
      { status: 500 }
    );
  }
}
