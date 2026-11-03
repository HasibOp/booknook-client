import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AuthShell from '@/components/auth/AuthShell';
import RegisterForm from '@/components/auth/RegisterForm';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Register',
};

export default async function RegisterPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect('/');

  return (
    <AuthShell
      title='Create your account'
      subtitle='Join BookNook to share your books and borrow from other readers.'
      sideTitle='Every shelf has a story to share.'
      sideText='Become a member in under a minute. Add the books you love, borrow new ones for a week and keep track of everything in one place.'
    >
      <RegisterForm />
    </AuthShell>
  );
}
