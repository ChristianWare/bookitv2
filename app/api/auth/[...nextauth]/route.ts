import { dbConnect } from "@/backend/config/dbConnect";
import User, { IUser } from "@/backend/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    session: {
      strategy: "jwt",
    },
    providers: [
      // @ts-ignore
      CredentialsProvider({
        async authorize(credentials) {
          dbConnect();

          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          const user = await User.findOne({ email }).select("+password");

          if (!user) {
            throw new Error("Invalid email or password");
          }

          const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
          );

          if (!isPasswordMatched) {
            throw new Error("Invalid email or password");
          }

          return user;
        },
      }),
    ],
    callbacks: {
      jwt: async ({ token, user }) => {
        user && (token.user = user);

        // TODO: update session when user is updated
        return token;
      },
      session: async ({ session, token }) => {
        session.user = token.user as IUser;

        // @ts-ignore
        delete session?.user?.password;

        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  });
}

export { auth as GET, auth as POST };
