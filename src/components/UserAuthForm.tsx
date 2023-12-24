// 'use client'

// import { cn } from '@/lib/utils'
// import { signIn } from 'next-auth/react'
// import * as React from 'react'
// import { FC } from 'react'
// import { Button } from '@/components/ui/Button'
// import { useToast } from '@/hooks/use-toast'
// import { Icons } from './Icons'

// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

// const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
//   const { toast } = useToast()
//   const [isLoading, setIsLoading] = React.useState<boolean>(false)

//   const loginWithGoogle = async () => {
//     setIsLoading(true)

//     try {
//       await signIn('google')
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'There was an error logging in with Google',
//         variant: 'destructive',
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className={cn('flex justify-center', className)} {...props}>
//       <Button
//         isLoading={isLoading}
//         type='button'
//         size='sm'
//         className='w-full'
//         onClick={loginWithGoogle}
//         disabled={isLoading}>
//         {isLoading ? null : <Icons.google className='h-4 w-4 mr-2' />}
//         Google
//       </Button>
//     </div>
//   )
// }

// export default UserAuthForm

"use client";

import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import React, { FC, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "./Icons";
import { Input } from "./ui/Input";
import { signUp } from "@/app/actions/signUp";
import { useRouter } from "next/router";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: "signIn" | "signUp";
}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, mode, ...props }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signIn") {
        // Sign in logic
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result && !result.error) {
          router.push("/"); // Redirect to home or dashboard
        } else {
          // Handle errors
          toast({
            title: "Authentication Failed",
            description: result?.error || "Unknown error occurred",
            variant: "destructive",
          });
        }
      } else {
        // Sign up logic
        const signUpMessage = await signUp(email, password);
        setMessage(signUpMessage);
        // Optionally sign in the user after sign up
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error with email/password authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col items-center space-y-4", className)}
      {...props}
    >
      <Button
        isLoading={isLoading}
        type="button"
        size="sm"
        className="w-full"
        onClick={loginWithGoogle}
        disabled={isLoading}
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Войти с Google
      </Button>

      <div className="relative flex items-center w-full">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-600">или</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col items-center space-y-2 w-full">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
          <Button
            isLoading={isLoading}
            type="submit"
            className="w-full mt-2"
            disabled={isLoading}
          >
            {mode === "signIn" ? "Login" : "Signup"}
          </Button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserAuthForm;
