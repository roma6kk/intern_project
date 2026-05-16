import { AuthProvider } from '@/entities/session';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}