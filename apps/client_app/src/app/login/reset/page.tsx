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

const resetSchema = z
  .object({
    email: z.string().email('Некорректный email'),
    code: z.string().regex(/^\d{6}$/, 'Код должен содержать 6 цифр'),
    newPassword: z.string().min(8, 'Минимум 8 символов'),
    confirmPassword: z.string().min(8, 'Подтвердите пароль'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    try {
      await api.post('/auth/reset-password', {
        email: data.email,
        code: data.code,
        newPassword: data.newPassword,
      });
      notify.success('Пароль успешно изменен');
      router.push('/');
    } catch (error: unknown) {
      const err = error as { message?: string };
      notify.error(err.message || 'Не удалось изменить пароль');
    }
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md items-center px-4 py-8">
      <div className="w-full rounded-2xl border border-border/70 bg-card/65 p-6 backdrop-blur-md">
        <h1 className="text-2xl font-semibold text-foreground">Сброс пароля</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Введите email, код из письма и новый пароль.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <Input {...register('email')} type="email" placeholder="Email" className="py-3 text-sm bg-card/70" />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Input {...register('code')} placeholder="Код из email" className="py-3 text-sm bg-card/70" />
            {errors.code && <p className="text-destructive text-xs mt-1">{errors.code.message}</p>}
          </div>

          <div>
            <Input
              {...register('newPassword')}
              type="password"
              placeholder="Новый пароль"
              className="py-3 text-sm bg-card/70"
            />
            {errors.newPassword && (
              <p className="text-destructive text-xs mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register('confirmPassword')}
              type="password"
              placeholder="Повторите пароль"
              className="py-3 text-sm bg-card/70"
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение...' : 'Сбросить пароль'}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link href="/login/forgot" className="text-primary font-medium hover:opacity-90">
            Отправить код заново
          </Link>
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            Назад ко входу
          </Link>
        </div>
      </div>
    </div>
  );
}
