import { RegistrationPortal } from "@/app/components/registration-portal";
import { prisma } from "@/lib/prisma";

const membershipTierLabels = {
  INDIVIDUAL: "Individual Contributor",
  INSTITUTIONAL: "Institutional Member",
  CORPORATE: "Corporate Member",
} as const;

type RecentMember = {
  id: string;
  fullName: string;
  email: string;
  githubHandle: string | null;
  affiliation: string | null;
  tier: keyof typeof membershipTierLabels;
  createdAt: Date;
};

type HomeProps = {
  searchParams: Promise<{
    registered?: string;
    registeredField?: "github" | "email";
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { registered, registeredField } = await searchParams;
  const recentMembers: RecentMember[] = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
    select: {
      id: true,
      fullName: true,
      email: true,
      githubHandle: true,
      affiliation: true,
      tier: true,
      createdAt: true,
    },
  });

  const isRegisteredMatch = (member: RecentMember) => {
    if (!registered) {
      return false;
    }

    if (registeredField === "email") {
      return member.email.toLowerCase() === registered.toLowerCase();
    }

    return member.githubHandle?.toLowerCase() === registered.toLowerCase();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-0 h-[36rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-200/80">
              Frenome.org
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Open standards for coordinated, accountable AGI systems.
            </p>
          </div>
          <div className="rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-100">
            Founding Member Registration
          </div>
        </header>

        <section className="grid flex-1 gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-slate-700 bg-white/5 px-4 py-1 text-sm text-slate-300 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              Coordinating standards for safe and interoperable AGI
            </div>

            <h1 className="mt-8 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Frenome.org: The Coordination Layer for Artificial General
              Intelligence.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Building open standards for Layered Perception, Explainable
              Reasoning, Agentic Action, and Gamified Learning so AGI can evolve
              with shared accountability, transparent governance, and public
              benefit at its core.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                "Layered Perception",
                "Explainable Reasoning",
                "Agentic Action",
                "Gamified Learning",
              ].map((pillar) => (
                <div
                  key={pillar}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-200/80">
                    Standards Track
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-white">
                    {pillar}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Structured collaboration for interoperable AGI components,
                    governance, and implementation guidance.
                  </p>
                </div>
              ))}
            </div>

            <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200/80">
                    Recent Registrations
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    Latest founding members
                  </h2>
                </div>
                <div className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-sm text-slate-300">
                  {recentMembers.length} listed
                </div>
              </div>

              {registered &&
              recentMembers.some((member: RecentMember) =>
                isRegisteredMatch(member),
              ) ? (
                <div className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100">
                  Registration received. Your newly created member record is now
                  visible below.
                </div>
              ) : null}

              {recentMembers.length > 0 ? (
                <ul className="mt-6 space-y-3">
                  {recentMembers.map((member: RecentMember) => (
                    <li
                      key={member.id}
                      className={`rounded-2xl border px-4 py-4 ${
                        isRegisteredMatch(member)
                          ? "border-emerald-300/40 bg-emerald-500/10 ring-1 ring-emerald-300/30"
                          : "border-white/10 bg-slate-900/70"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-white">
                            {member.fullName}
                          </p>
                          {member.githubHandle ? (
                            <p className="mt-1 text-sm text-slate-300">
                              @{member.githubHandle}
                            </p>
                          ) : (
                            <p className="mt-1 text-sm text-slate-500">
                              No GitHub handle provided
                            </p>
                          )}
                          <p className="mt-1 text-sm text-slate-400">
                            {member.affiliation || "Independent contributor"}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-medium text-blue-200">
                            {membershipTierLabels[member.tier]}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                            {member.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-sm leading-7 text-slate-300">
                  No members have registered yet. The first successful form
                  submission will appear here.
                </p>
              )}
            </section>
          </div>

          <RegistrationPortal />
        </section>
      </div>
    </main>
  );
}
