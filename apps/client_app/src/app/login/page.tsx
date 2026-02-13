'use client';

import { useState } from 'react';
import SignInForm from './signin';
import SignUpForm from './signup';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="flex min-h-screen bg-white">
      {/* Левая часть с изображением и текстом */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden">
        <div className="absolute top-8 left-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-white px-12 max-w-lg">
          <h1 className="text-4xl font-light mb-4 leading-tight">
            Посмотрите, какими моментами из жизни поделились ваши{' '}
            <span className="text-red-400 font-normal">близкие друзья</span>.
          </h1>
        </div>
        
        {/* Мокап телефонов */}
        <div className="absolute bottom-20 right-20">
          <div className="relative">
            <div className="w-64 h-96 bg-black rounded-3xl p-2 shadow-2xl transform rotate-12">
              <div className="w-full h-full bg-gray-900 rounded-2xl overflow-hidden">
                <div className="h-full bg-gradient-to-b from-purple-400 to-pink-400 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm">Stories</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 w-64 h-96 bg-black rounded-3xl p-2 shadow-2xl transform -rotate-6">
              <div className="w-full h-full bg-gray-900 rounded-2xl overflow-hidden">
                <div className="h-full bg-gradient-to-b from-blue-400 to-purple-400 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm">Feed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть с формой */}
      <div className="flex-1 lg:flex-none lg:w-96 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
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