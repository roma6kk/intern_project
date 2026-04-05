'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/shared/api';
import { useAuth } from '@/entities/session';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/cn';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  username: z.string().min(3, 'Min 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

type SignupForm = z.infer<typeof signupSchema>;

interface SignUpFormProps {
  onSwitch: () => void;
}

export default function SignUpForm({ onSwitch }: SignUpFormProps) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      const res = await api.post('/auth/signup', data);
      login(res.data.accessToken, res.data.user);
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      const fallbackError = error as {
        response?: { data?: { message?: string } | string };
      };

      let message: string | undefined;

      if (apiError?.message) {
        message = apiError.message;
      } else if (fallbackError.response?.data) {
        const data = fallbackError.response.data;
        if (typeof data === 'string') {
          message = data;
        } else if (typeof data === 'object' && 'message' in data) {
          message = (data as { message?: string }).message;
        }
      }

      alert(message || 'Signup failed');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { data } = await api.get('/auth/login/google');
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to init Google Auth', error);
    }
  };

  return (
    <div className={cn('w-full mx-auto rounded-2xl border border-border/70 bg-card/65 p-5 backdrop-blur-md sm:p-6')}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground">Create an account</h3>
        <p className="mt-1 text-sm text-muted-foreground">Fill in your details to start using Innogram.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <Input
              {...register('firstName')}
              placeholder="First name"
              type="text"
              className="text-sm py-2.5 bg-card/70"
            />
            {errors.firstName && (
              <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div className="w-1/2">
            <Input
              {...register('username')}
              placeholder="Username"
              type="text"
              className="text-sm py-2.5 bg-card/70"
            />
            {errors.username && (
              <p className="text-destructive text-xs mt-1">{errors.username.message}</p>
            )}
          </div>
        </div>

        <div>
          <Input {...register('email')} placeholder="Email" type="email" className="text-sm py-2.5 bg-card/70" />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Input
            {...register('password')}
            placeholder="Password"
            type="password"
            className="text-sm py-2.5 bg-card/70"
          />
          {errors.password && (
            <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" variant="primary" className="w-full py-2.5 font-semibold" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignup}
          type="button"
          className="w-full mt-2 flex items-center justify-center gap-2 text-foreground font-semibold text-sm rounded-xl py-2.5 border border-border/75 hover:bg-muted/60 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </button>

        <p className="text-center text-sm text-muted-foreground mt-2">
          Already have an account?{' '}
          <button type="button" onClick={onSwitch} className="text-primary font-semibold hover:opacity-90">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
