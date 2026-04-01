"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type MembershipTier =
  | "Individual Contributor"
  | "Institutional Member"
  | "Corporate Member";

type RegistrationForm = {
  fullName: string;
  email: string;
  githubHandle: string;
  organization: string;
  membershipTier: MembershipTier;
  agreedToOfla: boolean;
};

const initialForm: RegistrationForm = {
  fullName: "",
  email: "",
  githubHandle: "",
  organization: "",
  membershipTier: "Individual Contributor",
  agreedToOfla: false,
};

const membershipOptions: Array<{
  value: MembershipTier;
  apiValue: "INDIVIDUAL" | "INSTITUTIONAL" | "CORPORATE";
  description: string;
}> = [
  {
    value: "Individual Contributor",
    apiValue: "INDIVIDUAL",
    description:
      "Dynamic voting weight for independent researchers, builders, and stewards.",
  },
  {
    value: "Institutional Member",
    apiValue: "INSTITUTIONAL",
    description:
      "For universities, labs, and non-profits collaborating on open AGI standards.",
  },
  {
    value: "Corporate Member",
    apiValue: "CORPORATE",
    description:
      "Capped voting weight for commercial organizations contributing to the ecosystem.",
  },
];

export function RegistrationPortal() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistrationForm>(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const selectedTier = membershipOptions.find(
        (option) => option.value === formData.membershipTier,
      );

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          githubHandle: formData.githubHandle,
          affiliation: formData.organization,
          tier: selectedTier?.apiValue ?? "INDIVIDUAL",
          oflaAgreed: formData.agreedToOfla,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setSubmitError(
          result.error ??
            "Unable to submit registration right now. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }

      const registeredHandle = formData.githubHandle.trim().replace(/^@/, "");
      const registeredValue = registeredHandle || formData.email.trim().toLowerCase();
      const registeredField = registeredHandle ? "github" : "email";
      router.replace(
        `/?registered=${encodeURIComponent(registeredValue)}&registeredField=${registeredField}`,
        {
          scroll: false,
        },
      );
      router.refresh();
      setIsSubmitted(true);
      setIsSubmitting(false);
    } catch {
      setSubmitError(
        "Unable to submit registration right now. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative">
      <div className="absolute inset-0 rounded-3xl bg-blue-500/10 blur-3xl" />
      <div className="relative rounded-3xl border border-slate-200/10 bg-white px-6 py-7 text-slate-900 shadow-2xl shadow-slate-950/30 sm:px-8">
        {!isSubmitted ? (
          <>
            <div className="border-b border-slate-200 pb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-900">
                Member Registration
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Join the founding standards community
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Register your interest to participate in Frenome governance,
                standards development, and open-source implementation efforts.
              </p>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-700"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Ada Lovelace"
                  required
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-700"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="ada@institute.org"
                  required
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-700"
                  htmlFor="githubHandle"
                >
                  GitHub Handle (Optional)
                </label>
                <input
                  id="githubHandle"
                  type="text"
                  value={formData.githubHandle}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      githubHandle: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="@ada-labs"
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-700"
                  htmlFor="organization"
                >
                  Organization / Affiliation (Optional)
                </label>
                <input
                  id="organization"
                  type="text"
                  value={formData.organization}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      organization: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Open Research Institute"
                />
              </div>

              <fieldset>
                <legend className="mb-3 block text-sm font-medium text-slate-700">
                  Membership Tiers
                </legend>
                <div className="space-y-3">
                  {membershipOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <input
                        type="radio"
                        name="membershipTier"
                        value={option.value}
                        checked={formData.membershipTier === option.value}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            membershipTier:
                              event.target.value as MembershipTier,
                          }))
                        }
                        className="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {option.value}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={formData.agreedToOfla}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      agreedToOfla: event.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-sm leading-6 text-slate-700">
                  I agree to the Open Frenome License Agreement (OFLA),
                  including the copyleft pass-back requirements for core AGI
                  modifications.
                </span>
              </label>

              {submitError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-500"
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex min-h-[30rem] flex-col justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-lg font-semibold text-white">
              OK
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Registration Pending
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Thank you for joining Frenome.org
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Your submission has been captured for review. We will follow up
              with next steps for onboarding, governance participation, and
              standards working groups.
            </p>
            <button
              type="button"
              onClick={() => {
                setFormData(initialForm);
                setIsSubmitted(false);
                setSubmitError("");
              }}
              className="mt-8 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Register another member
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
