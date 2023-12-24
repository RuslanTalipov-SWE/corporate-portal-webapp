// "use client";

// import { FC } from "react";
// import { Icons } from "@/components/Icons";
// import UserAuthForm from "@/components/UserAuthForm";
// import Link from "next/link";

// interface SignInProps {
//   isModal?: boolean;
// }

// const SignIn: FC<SignInProps> = ({ isModal = false }) => {
//   return (
//     <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
//       {/* <div className="flex flex-col items-center space-y-4 text-center">
//         <Icons.logo className="mx-auto h-6 w-6 mb-8" />
//       </div> */}

//       {/* <UserAuthForm /> */}
//       <UserAuthForm mode="signIn" />

//       <p className="px-8 text-center text-sm text-muted-foreground">
//         New to Breaddit?{" "}
//         <Link
//           href="/sign-up"
//           className="hover:text-brand text-sm underline underline-offset-4"
//           replace={isModal}
//         >
//           Sign Up
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default SignIn;

"use client";

import { FC } from "react";
import { Icons } from "@/components/Icons";
import UserAuthForm from "@/components/UserAuthForm";
import Link from "next/link";

interface SignInProps {
  isModal?: boolean;
}

const SignIn: FC<SignInProps> = ({ isModal = false }) => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      {/* <div className="flex flex-col items-center space-y-4 text-center">
        <Icons.logo className="mx-auto h-6 w-6 mb-8" />
      </div> */}

      {/* <UserAuthForm /> */}
      <UserAuthForm mode="signIn" />

      <p className="px-8 text-center text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link
          href="/sign-up"
          className="hover:text-brand text-sm underline underline-offset-4"
          replace={isModal}
        >
          Создать аккаунт
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
