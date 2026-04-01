"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("email", {
      email: email.trim().toLowerCase(),
      callbackUrl: "/dashboard",
      redirect: false,
    });

    if (result?.error) {
      setError(
        "This email is not authorized for member access yet. Only registered OFLA signers can log in.",
      );
      setIsSubmitting(false);
      return;
    }

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-0 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />

      <section className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-200/80">
          Frenome Member Access
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Passwordless login
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Enter your registered email address and we&apos;ll send you a secure
          magic link to access the member dashboard.
        </p>

        {!isSubmitted ? (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-200"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                placeholder="member@frenome.org"
                required
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400/20 disabled:cursor-not-allowed disabled:bg-slate-600"
            >
              {isSubmitting ? "Sending magic link..." : "Email me a magic link"}
            </button>
          </form>
        ) : (
          <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-5 text-sm leading-7 text-emerald-100">
            Check your inbox for a secure sign-in link. It will take you
            directly to your member dashboard.
          </div>
        )}
      </section>
    </main>
  );
}
