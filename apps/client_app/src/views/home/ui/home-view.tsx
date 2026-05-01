'use client';

import Image from 'next/image';
import { useToast } from '@/application/providers/toast-provider';

export function HomeView() {
  const { success, error, info, warning } = useToast();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-8 sm:px-16 bg-background sm:items-start">
        <Image
          className="dark:invert opacity-90"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-muted-foreground">
            Looking for a starting point or more instructions? Head over to{' '}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-primary hover:opacity-90"
            >
              Templates
            </a>{' '}
            or the{' '}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-primary hover:opacity-90"
            >
              Learning
            </a>{' '}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-success px-5 text-white transition-opacity hover:opacity-90 md:w-auto"
            onClick={() => success('Успешно!')}
          >
            Success
          </button>
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-destructive px-5 text-destructive-foreground transition-opacity hover:opacity-90 md:w-auto"
            onClick={() => error('Ошибка!')}
          >
            Error
          </button>
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-primary-foreground transition-opacity hover:opacity-90 md:w-auto"
            onClick={() => info('Информация')}
          >
            Info
          </button>
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-warning px-5 text-white transition-opacity hover:opacity-90 md:w-auto"
            onClick={() => warning('Предупреждение')}
          >
            Warning
          </button>
        </div>
      </main>
    </div>
  );
}
