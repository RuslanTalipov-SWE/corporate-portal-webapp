"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import Link from "next/link";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  email: z.string().min(1, "Введите email").email("Неверный формат email"),
  password: z
    .string()
    .min(1, "Введите пароль")
    .min(8, "Пароль должен содержать не менее 8 символов"),
});

const SignInForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      // redirect: false,
    });

    if (signInData?.error) {
      toast({
        title: "Ошибка",
        description: "Введен неверный email или пароль",
        variant: "destructive",
      });
    } else {
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <h1 className="font-bold text-3xl md:text-4xl text-center mb-6">Вход</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="mail@example.com"
                    {...field}
                    style={{
                      fontSize: "14px",
                      padding: "10px",
                      width: "100%",
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Введите ваш пароль"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full mt-6" type="submit">
          Войти
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-2">
        Нет аккаунта?&nbsp;
        <Link className="text-blue-500 hover:underline" href="/sign-up">
          Зарегистрироваться
        </Link>
      </p>
    </Form>
  );
};

export default SignInForm;
