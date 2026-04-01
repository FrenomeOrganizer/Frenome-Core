import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

type ExistingUser = {
  id: string;
  oflaAgreed: boolean;
};

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function buildMagicLinkEmail(url: string, host: string) {
  const escapedHost = host.replace(/\./g, "&#8203;.");

  return {
    subject: `Sign in to ${host}`,
    text: `Sign in to ${host}\n${url}\n\n`,
    html: `
      <body style="background:#0f172a;color:#e2e8f0;font-family:Arial,sans-serif;padding:24px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#111827;border:1px solid rgba(148,163,184,0.18);border-radius:18px;overflow:hidden;">
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#93c5fd;">
                Frenome Member Access
              </p>
              <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#ffffff;">
                Sign in to ${escapedHost}
              </h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#cbd5e1;">
                Use the secure magic link below to access your Frenome member dashboard.
              </p>
              <a href="${url}" style="display:inline-block;padding:14px 20px;border-radius:12px;background:#2563eb;color:#ffffff;font-weight:600;text-decoration:none;">
                Open Member Dashboard
              </a>
              <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#94a3b8;">
                If the button does not work, copy and paste this URL into your browser:
              </p>
              <p style="margin:8px 0 0;font-size:13px;line-height:1.7;word-break:break-all;color:#bfdbfe;">
                <a href="${url}" style="color:#bfdbfe;">${url}</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
    `,
  };
}

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
      from: emailFrom,
      async sendVerificationRequest({ identifier, url, provider }) {
        if (!resend) {
          throw new Error("RESEND_API_KEY is not set.");
        }

        if (!provider.from) {
          throw new Error("EMAIL_FROM is not set.");
        }

        const { host } = new URL(url);
        const email = buildMagicLinkEmail(url, host);

        const result = await resend.emails.send({
          from: provider.from,
          to: identifier,
          subject: email.subject,
          text: email.text,
          html: email.html,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      },
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
