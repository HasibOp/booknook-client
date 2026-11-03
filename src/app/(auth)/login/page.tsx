import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';
import { auth } from '@/lib/auth';
import { safeRedirect } from '@/lib/safe-redirect';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { redirect: redirectParam, error } = await searchParams;
  const redirectTo = safeRedirect(redirectParam);

  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect(redirectTo);

  return (
    <AuthShell
      title='Welcome back'
      subtitle='Log in to borrow books, add your own and see what you are reading.'
      sideTitle='Your next favourite book is waiting.'
      sideText='Pick up where you left off. Check your borrowed books, return the ones you have finished and discover something new on the shelves.'
    >
      <LoginForm
        redirectTo={redirectTo}
        googleError={typeof error === 'string' ? error : undefined}
      />
    </AuthShell>
  );
}
