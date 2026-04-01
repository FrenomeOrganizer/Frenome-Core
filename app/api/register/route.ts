import { MembershipTier } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RegisterRequestBody = {
  fullName?: string;
  email?: string;
  githubHandle?: string;
  affiliation?: string;
  website?: string;
  tier?: keyof typeof MembershipTier;
  oflaAgreed?: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterRequestBody;

    const fullName = body.fullName?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const githubHandle = body.githubHandle?.trim().replace(/^@/, "") ?? "";
    const normalizedGithubHandle = githubHandle === "" ? null : githubHandle;
    const affiliation = body.affiliation?.trim() ?? "";
    const website = body.website?.trim() ?? "";
    const tier = body.tier ?? "INDIVIDUAL";
    const oflaAgreed = body.oflaAgreed === true;

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (!oflaAgreed) {
      return NextResponse.json(
        { error: "You must agree to the OFLA to register." },
        { status: 400 },
      );
    }

    if (!(tier in MembershipTier)) {
      return NextResponse.json(
        { error: "Invalid membership tier." },
        { status: 400 },
      );
    }

    await prisma.user.create({
      data: {
        fullName,
        email,
        githubHandle: normalizedGithubHandle,
        affiliation: affiliation || null,
        tier: MembershipTier[tier],
        oflaAgreed,
        oflaAgreedAt: oflaAgreed ? new Date() : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002" &&
      "meta" in error &&
      error.meta &&
      typeof error.meta === "object" &&
      "target" in error.meta &&
      Array.isArray(error.meta.target)
    ) {
      const targets = error.meta.target as string[];

      if (targets.includes("githubHandle")) {
        return NextResponse.json(
          { error: "This GitHub handle is already registered." },
          { status: 400 },
        );
      }

      if (targets.includes("email")) {
        return NextResponse.json(
          { error: "This email address is already registered." },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: "This member is already registered." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Unable to submit registration right now. Please try again." },
      { status: 500 },
    );
  }
}
