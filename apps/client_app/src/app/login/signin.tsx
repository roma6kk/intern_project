'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface SignInFormProps {
  onSwitch: () => void;
}

export default function SignInForm({ onSwitch }: SignInFormProps) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.accessToken, res.data.user);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
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
    <div className="w-full max-w-sm mx-auto bg-white border border-gray-300 rounded-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-6" style={{fontFamily: 'Billabong, cursive'}}>Innogram</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Input 
            {...register('email')} 
            placeholder="Username, phone number or email address" 
            type="email" 
            className="w-full px-3 py-3 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 text-gray-900"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('password')}
            placeholder="Password"
            type="password"
            className="w-full px-3 py-3 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 text-gray-900"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm mt-4 disabled:opacity-50"
        >
          {isSubmitting ? 'Loading...' : 'Log In'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-500 font-semibold">OR</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full mt-6 flex items-center justify-center gap-2 text-blue-900 font-semibold text-sm hover:text-blue-700"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Log in with Google
        </button>

        <div className="text-center mt-6">
          <button className="text-blue-900 text-sm hover:text-blue-700">
            Forgot password?
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            onClick={onSwitch}
            className="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Sign up
          </button>
        </p>
      </div>

    </div>
  );
}