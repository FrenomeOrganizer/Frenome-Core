import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";

type ExistingUser = {
  id: string;
  oflaAgreed: boolean;
};

const emailServer =
  process.env.EMAIL_SERVER ??
  ({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
    auth:
      process.env.EMAIL_SERVER_USER || process.env.EMAIL_SERVER_PASSWORD
        ? {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          }
        : undefined,
  } satisfies Parameters<typeof EmailProvider>[0]["server"]);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as Parameters<typeof PrismaAdapter>[0]),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    EmailProvider({
      server: emailServer,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user, email }) {
      const normalizedEmail = user.email?.trim().toLowerCase();

      if (!normalizedEmail) {
        return false;
      }

      if (email?.verificationRequest) {
        const existingUser = (await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
          },
          select: {
            id: true,
            oflaAgreed: true,
          },
        })) as ExistingUser | null;

        return existingUser?.oflaAgreed === true;
      }

      return true;
    },
  },
};
