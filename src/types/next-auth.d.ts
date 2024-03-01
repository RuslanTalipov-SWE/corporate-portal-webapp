// import type { Session, User } from "next-auth";
// import type { JWT } from "next-auth/jwt";

// type UserId = string;

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: UserId;
//     username?: string | null;
//   }
// }

// declare module "next-auth" {
//   interface Session {
//     user: User & {
//       id: UserId;
//       username?: string | null;
//     };
//   }
// }

// import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface User {
//     username: string;
//   }
//   interface Session {
//     user: User & {
//       username: string;
//     };
//     token: {
//       username: string;
//     };
//   }
// }

import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

type UserId = string;

declare module "next-auth" {
  interface User {
    id: UserId;
    username: string;
  }

  interface Session {
    user: User & {
      id: UserId;
      username: string;
    };
    token: {
      username: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    username?: string | null;
  }
}
