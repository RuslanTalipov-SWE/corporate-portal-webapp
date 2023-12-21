"use client";

import { FC } from "react";
import { Icons } from "@/components/Icons";
import UserAuthForm from "@/components/UserAuthForm";
import Link from "next/link";

interface SignUpProps {
  isModal?: boolean;
}

const SignUp: FC<SignUpProps> = ({ isModal = false }) => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      {/* <div className="flex flex-col items-center space-y-4 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
      </div> */}

      {/* <UserAuthForm /> */}
      <UserAuthForm mode="signUp" />

      <p className="px-8 text-center text-sm text-muted-foreground">
        Already a Breadditor?{" "}
        <Link
          href="/sign-in"
          className="hover:text-brand text-sm underline underline-offset-4"
          replace={isModal}
        >
          Войти
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
