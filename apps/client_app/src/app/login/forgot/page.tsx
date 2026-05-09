'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api from '@/shared/api';
import { notify } from '@/shared/lib/notify';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

const forgotSchema = z.object({
  email: z.string().email('Некорректный email'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    try {
      await api.post('/auth/forgot-password', data);
      notify.success('Код отправлен на email');
      router.push('/login/reset');
    } catch (error: unknown) {
      const err = error as { message?: string };
      notify.error(err.message || 'Не удалось отправить код');
    }
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md items-center px-4 py-8">
      <div className="w-full rounded-2xl border border-border/70 bg-card/65 p-6 backdrop-blur-md">
        <h1 className="text-2xl font-semibold text-foreground">Восстановление пароля</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Введите email, и мы отправим код подтверждения.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <Input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="py-3 text-sm bg-card/70"
            />
            {errors.email && (
              <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Отправить код'}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link href="/login/reset" className="text-primary font-medium hover:opacity-90">
            У меня уже есть код
          </Link>
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            Назад ко входу
          </Link>
        </div>
      </div>
    </div>
  );
}
