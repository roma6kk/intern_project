'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useAuth } from '@/context.tsx/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.accessToken, res.data.user);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Innogram</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register('email')} placeholder="Email" type="email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          
          <div>
            <Input {...register('password')} placeholder="Password" type="password" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 flex flex-col gap-3">
          <Button variant="secondary" onClick={handleGoogleLogin}>
            Sign in with Google
          </Button>
          
          <p className="text-center text-sm">
            Don't have an account? <Link href="/signup" className="text-blue-600">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}