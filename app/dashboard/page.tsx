import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const verificationLevels = [
  "NONE",
  "TIER_1_DIGITAL",
  "TIER_2_STAKE",
  "TIER_3_KYC",
] as const;

type VerificationLevel = (typeof verificationLevels)[number];

const verificationLabels = {
  NONE: "Unverified",
  TIER_1_DIGITAL: "Digitally Verified",
  TIER_2_STAKE: "Staked Member",
  TIER_3_KYC: "KYC Verified",
} as const satisfies Record<VerificationLevel, string>;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email.toLowerCase(),
    },
    select: {
      fullName: true,
      email: true,
      votingWeight: true,
      verificationLevel: true,
      tier: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-200/80">
            Member Dashboard
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Welcome, {user.fullName}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Your Frenome membership profile is active. This dashboard will
            expand as governance, verification, and agentic coordination tools
            come online.
          </p>
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Voting Weight
            </p>
            <p className="mt-4 text-4xl font-semibold text-white">
              {user.votingWeight.toFixed(1)}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Current membership tier: {user.tier.replace("_", " ")}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Verification
            </p>
            <p className="mt-4 text-2xl font-semibold text-white">
              Status: {verificationLabels[user.verificationLevel]} (
              {user.verificationLevel})
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Higher verification levels will unlock future governance and agent
              authorization capabilities.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-dashed border-blue-400/30 bg-blue-500/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-200/80">
            Authorized Agents
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            Coming Soon: Agentic Integration (FEP-002)
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Members will be able to authorize trusted agents to participate in
            defined workflows under Frenome governance controls and progressive
            trust policies.
          </p>
        </section>
      </div>
    </main>
  );
}
