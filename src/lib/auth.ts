// import { db } from '@/lib/db'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import { nanoid } from 'nanoid'
// import { NextAuthOptions, getServerSession } from 'next-auth'
// import GoogleProvider from 'next-auth/providers/google'

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(db),
//   session: {
//     strategy: 'jwt',
//   },
//   pages: {
//     signIn: '/sign-in',
//   },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async session({ token, session }) {
//       if (token) {
//         session.user.id = token.id
//         session.user.name = token.name
//         session.user.email = token.email
//         session.user.image = token.picture
//         session.user.username = token.username
//       }

//       return session
//     },

//     async jwt({ token, user }) {
//       const dbUser = await db.user.findFirst({
//         where: {
//           email: token.email,
//         },
//       })

//       if (!dbUser) {
//         token.id = user!.id
//         return token
//       }

//       if (!dbUser.username) {
//         await db.user.update({
//           where: {
//             id: dbUser.id,
//           },
//           data: {
//             username: nanoid(10),
//           },
//         })
//       }

//       return {
//         id: dbUser.id,
//         name: dbUser.name,
//         email: dbUser.email,
//         picture: dbUser.image,
//         username: dbUser.username,
//       }
//     },
//     redirect() {
//       return '/'
//     },
//   },
// }

// export const getAuthSession = () => getServerSession(authOptions)

// import { db } from '@/lib/db'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import { nanoid } from 'nanoid'
// import { NextAuthOptions, getServerSession } from 'next-auth'
// import GoogleProvider from 'next-auth/providers/google'

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(db),
//   session: {
//     strategy: 'jwt',
//   },
//   pages: {
//     signIn: '/sign-in',
//   },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async session({ token, session }) {
//       if (token) {
//         session.user.id = token.id
//         session.user.name = token.name
//         session.user.email = token.email
//         session.user.image = token.picture
//         session.user.username = token.username
//       }

//       return session
//     },

//     async jwt({ token, user }) {
//       const dbUser = await db.user.findFirst({
//         where: {
//           email: token.email,
//         },
//       })

//       if (!dbUser) {
//         token.id = user!.id
//         return token
//       }

//       if (!dbUser.username) {
//         await db.user.update({
//           where: {
//             id: dbUser.id,
//           },
//           data: {
//             username: nanoid(10),
//           },
//         })
//       }

//       return {
//         id: dbUser.id,
//         name: dbUser.name,
//         email: dbUser.email,
//         picture: dbUser.image,
//         username: dbUser.username,
//       }
//     },
//     redirect() {
//       return '/'
//     },
//   },
// }

// export const getAuthSession = () => getServerSession(authOptions)
import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
//import bcrypt from "bcrypt";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing credentials");
        }
        /*  const { email, password } = credentials as { email: string; password: string; }; */
        const user = await db.user.findUnique({
          // @ts-ignore
          where: { email: credentials.email },
        });
        if (!user) {
          return null;
        }
        // @ts-ignore
        if (!credentials.password) {
          return null;
        }
        // @ts-ignore
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password ?? ""
        );

        if (!passwordsMatch) {
          console.log("password doesn't match auth.ts");
          return null;
        }

        return user;
      },
    }),
    GoogleProvider({
      id: "google",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },

    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        /*  username: dbUser.username, */
      };
    },
    redirect() {
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
