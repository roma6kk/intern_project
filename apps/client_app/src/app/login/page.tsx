'use client';

import Image from 'next/image';
import { useState } from 'react';
import SignInForm from './signin';
import SignUpForm from './signup';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-2">
      {/* Left — visual */}
      <aside className="relative hidden overflow-hidden bg-[#0c1029] lg:block">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[conic-gradient(from_200deg_at_30%_40%,#4338ca_0%,#0891b2_35%,#c026d3_65%,#4338ca_100%)] opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(255,255,255,0.12),transparent)]" />
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(52vw,36rem)] w-[min(52vw,36rem)] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <div className="absolute inset-[12%] rounded-full border border-white/15" />
          <div className="absolute inset-[24%] rounded-full border border-white/10" />
          <div className="absolute inset-[36%] overflow-hidden rounded-full border border-white/20 bg-white/8 shadow-lg backdrop-blur-sm">
            <Image
              src="/login_image3.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 15vw, 240px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="pointer-events-none absolute left-[12%] top-[18%] h-28 w-28 overflow-hidden rounded-3xl border border-white/25 bg-white/10 shadow-2xl backdrop-blur-md animate-[innogram-float_9s_ease-in-out_infinite]">
          <Image
            src="/login_image1.jpg"
            alt=""
            fill
            sizes="112px"
            className="object-cover"
            priority
          />
        </div>
        <div className="pointer-events-none absolute bottom-[22%] right-[14%] h-20 w-20 overflow-hidden rounded-full border border-white/30 bg-white/10 shadow-xl backdrop-blur-md animate-[innogram-float_11s_ease-in-out_infinite_reverse]">
          <Image
            src="/login_image2.jpg"
            alt=""
            fill
            sizes="80px"
            className="object-cover"
            priority
          />
        </div>
        <div className="pointer-events-none absolute right-[28%] top-[32%] h-3 w-3 rounded-full bg-white/70 animate-pulse" />
        <div className="pointer-events-none absolute bottom-[38%] left-[22%] h-2 w-2 rounded-full bg-cyan-300/80" />

        <div className="relative z-10 flex h-full flex-col justify-end p-10 xl:p-14">
          <span className="text-2xl font-semibold tracking-tight text-white">Innogram</span>
        </div>
      </aside>

      {/* Right — form */}
      <main className="relative flex flex-col justify-center overflow-y-auto bg-background px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
        <div className="pointer-events-none absolute inset-0 lg:hidden">
          <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-cyan-500/12 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <span className="mb-8 block text-xl font-semibold tracking-tight text-foreground lg:hidden">
            Innogram
          </span>

          <div className="mb-6 grid grid-cols-2 rounded-xl border border-border bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Регистрация
            </button>
          </div>

          <div className="animate-[innogram-slide-up_0.4s_ease-out_both]">
            {mode === 'signin' ? (
              <SignInForm onSwitch={() => setMode('signup')} />
            ) : (
              <SignUpForm onSwitch={() => setMode('signin')} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
