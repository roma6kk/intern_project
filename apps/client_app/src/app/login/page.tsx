'use client';

import { useState } from 'react';
import SignInForm from './signin';
import SignUpForm from './signup';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="flex min-h-screen bg-transparent">
      <div className="hidden lg:flex lg:flex-1 items-center justify-center relative overflow-hidden bg-gradient-to-br from-[var(--hero-from)] via-[var(--hero-via)] to-[var(--hero-to)] auroraSweep">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12),_transparent_55%)] pointer-events-none" />
        <div className="absolute top-8 left-8 z-10">
          <div className="w-12 h-12 bg-card/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
            <div className="w-8 h-8 border-2 border-white/90 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-card rounded-full" />
            </div>
          </div>
        </div>

        <div className="text-center text-white px-12 max-w-xl relative z-10">
          <h1 className="text-5xl font-light mb-4 leading-tight drop-shadow-sm">
            Посмотрите, какими моментами из жизни поделились ваши{' '}
            <span className="text-amber-200 font-normal">близкие друзья</span>.
          </h1>
          <p className="text-white/80">Сцена нового поколения: визуальная лента, живые реакции и кинематографичный ритм интерфейса.</p>
        </div>

        <div className="absolute bottom-20 right-20 z-10">
          <div className="relative">
            <div className="w-64 h-96 bg-zinc-950 rounded-3xl p-2 shadow-2xl transform rotate-12 ring-1 ring-white/10">
              <div className="w-full h-full bg-zinc-900 rounded-2xl overflow-hidden">
                <div className="h-full bg-gradient-to-b from-fuchsia-400/90 to-pink-500/90 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-card/25 rounded-full mx-auto mb-2 backdrop-blur-sm" />
                    <div className="text-sm font-medium">Stories</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 w-64 h-96 bg-zinc-950 rounded-3xl p-2 shadow-2xl transform -rotate-6 ring-1 ring-white/10">
              <div className="w-full h-full bg-zinc-900 rounded-2xl overflow-hidden">
                <div className="h-full bg-gradient-to-b from-sky-400/90 to-violet-500/90 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-card/25 rounded-full mx-auto mb-2 backdrop-blur-sm" />
                    <div className="text-sm font-medium">Feed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 lg:flex-none lg:w-[27rem] flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-[rika-slide-up_0.4s_ease-out_both]">
          {mode === 'signin' ? (
            <SignInForm onSwitch={() => setMode('signup')} />
          ) : (
            <SignUpForm onSwitch={() => setMode('signin')} />
          )}
        </div>
      </div>
    </div>
  );
}
