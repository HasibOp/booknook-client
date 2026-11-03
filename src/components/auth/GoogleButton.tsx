'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from '@/lib/auth-client';

type GoogleButtonProps = {
  callbackURL?: string;
  label?: string;
};

export default function GoogleButton({
  callbackURL = '/',
  label = 'Continue with Google',
}: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const { error } = await signIn.social({
      provider: 'google',
      callbackURL,
      errorCallbackURL: '/login',
    });
    if (error) {
      toast.error(error.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={loading}
      className='btn btn-outline w-full rounded-full border-base-300 bg-base-100 font-semibold hover:border-base-content/30 hover:bg-base-200 hover:text-base-content'
    >
      {loading ? (
        <span className='loading loading-spinner loading-sm' />
      ) : (
        <FcGoogle className='size-5' />
      )}
      {label}
    </button>
  );
}
