'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import SignInForm from './signin';
import SignUpForm from './signup';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="relative box-border h-[100dvh] overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl animate-[rika-float_9s_ease-in-out_infinite]" />
        <div className="absolute -right-16 top-8 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-[rika-float_11s_ease-in-out_infinite_reverse]" />
        <div className="absolute -bottom-10 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/18 blur-3xl animate-[rika-float_13s_ease-in-out_infinite]" />
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.35)_0%,transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.25)_0%,transparent_32%)]" />
      </div>

      <div className="relative mx-auto grid h-full w-full max-w-6xl items-center gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden h-full min-h-[36rem] overflow-hidden rounded-[2rem] border border-white/45 bg-white/40 shadow-[0_30px_100px_-40px_rgba(31,47,130,0.5)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1736b0] lg:block">
          <div className="absolute inset-0 bg-[conic-gradient(from_210deg_at_50%_50%,rgba(99,102,241,0.35),rgba(6,182,212,0.28),rgba(236,72,153,0.35),rgba(99,102,241,0.35))]" />
          <div className="absolute inset-0 backdrop-blur-[48px]" />
          <div className="absolute left-1/2 top-1/2 h-[27rem] w-[27rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35" />
          <div className="absolute left-1/2 top-1/2 h-[21rem] w-[21rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
          <div className="absolute left-1/2 top-1/2 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />

          <div className="absolute left-14 top-14 h-24 w-24 rounded-3xl border border-white/35 bg-white/25 shadow-xl backdrop-blur-md animate-[rika-float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-16 right-14 h-20 w-20 rounded-full border border-white/40 bg-white/20 shadow-xl backdrop-blur-md animate-[rika-float_10s_ease-in-out_infinite]" />
          <div className="absolute right-18 top-24 h-3 w-3 rounded-full bg-white/80 animate-ping" />
          <div className="absolute bottom-20 left-20 h-2.5 w-2.5 rounded-full bg-cyan-200/90 animate-pulse" />

          <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-white/80">Innogram</p>
              <h2 className="mt-3 max-w-sm text-3xl font-semibold leading-tight">
                Welcome to your account
              </h2>
              <p className="mt-3 max-w-sm text-sm text-white/80">
                Log in or sign up to continue using the app.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/35 bg-white/20 px-4 py-3 text-sm backdrop-blur-md">
                Unified access to your profile, feed and messages
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white/90 backdrop-blur-md">
                Secure authentication and protected sessions
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white/90 backdrop-blur-md">
                Fast sign-in with email or Google
              </div>
            </div>
          </div>
        </section>

        <section className="relative w-full max-w-[34rem] justify-self-center overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-4 shadow-[0_30px_90px_-35px_rgba(31,47,130,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1736d9] sm:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(145,157,255,0.22),transparent_58%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(124,135,255,0.25),transparent_52%)]" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-16 h-44 w-44 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Authentication</p>
                <h1 className="mt-1 text-2xl font-semibold text-foreground">Log in to Innogram</h1>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-2xl border border-border/70 bg-muted/50 p-1.5">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                  mode === 'signin' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                  mode === 'signup' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl">
              <div className="pointer-events-none absolute inset-0 -z-10 opacity-50 [background:radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.16),transparent_40%),radial-gradient(circle_at_100%_0%,rgba(236,72,153,0.16),transparent_38%)]" />
              <div className="animate-[rika-slide-up_0.45s_ease-out_both]">
                {mode === 'signin' ? (
                  <SignInForm onSwitch={() => setMode('signup')} />
                ) : (
                  <SignUpForm onSwitch={() => setMode('signin')} />
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Connection is secure and encrypted</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
