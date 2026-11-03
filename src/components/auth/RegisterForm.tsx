'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { signOut, signUp } from '@/lib/auth-client';
import { EMAIL_PATTERN, isHttpUrl, validatePassword } from '@/lib/validators';
import FormField from './FormField';
import GoogleButton from './GoogleButton';
import PasswordChecklist from './PasswordChecklist';

type RegisterValues = {
  name: string;
  email: string;
  photoURL: string;
  password: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    defaultValues: { name: '', email: '', photoURL: '', password: '' },
  });

  const password = useWatch({ control, name: 'password' });

  const onSubmit = async (values: RegisterValues) => {
    setFormError('');
    const { error } = await signUp.email({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      image: values.photoURL.trim(),
    });

    if (error) {
      const message = error.message || 'Registration failed. Please try again.';
      setFormError(message);
      toast.error(message);
      return;
    }

    await signOut();
    toast.success('Account created! Please log in.');
    router.push('/login');
  };

  return (
    <div className='flex flex-col gap-6'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='flex flex-col gap-4'
      >
        <FormField
          label='Full name'
          htmlFor='name'
          error={errors.name?.message}
        >
          <input
            id='name'
            type='text'
            autoComplete='name'
            placeholder='e.g. Ayesha Rahman'
            className={`input w-full ${errors.name ? 'input-error' : ''}`}
            {...register('name', {
              required: 'Please enter your name',
              validate: (value) =>
                value.trim().length >= 2 ||
                'Name must be at least 2 characters',
            })}
          />
        </FormField>

        <FormField label='Email' htmlFor='email' error={errors.email?.message}>
          <input
            id='email'
            type='email'
            autoComplete='email'
            placeholder='you@example.com'
            className={`input w-full ${errors.email ? 'input-error' : ''}`}
            {...register('email', {
              required: 'Please enter your email',
              pattern: {
                value: EMAIL_PATTERN,
                message: 'Please enter a valid email address',
              },
            })}
          />
        </FormField>

        <FormField
          label='Photo URL'
          htmlFor='photoURL'
          error={errors.photoURL?.message}
        >
          <input
            id='photoURL'
            type='url'
            placeholder='https://example.com/your-photo.jpg'
            className={`input w-full ${errors.photoURL ? 'input-error' : ''}`}
            {...register('photoURL', {
              required: 'Please add a link to your photo',
              validate: (value) =>
                isHttpUrl(value.trim()) || 'Please enter a valid image link',
            })}
          />
        </FormField>

        <FormField
          label='Password'
          htmlFor='password'
          error={errors.password?.message}
        >
          <label
            className={`input w-full ${errors.password ? 'input-error' : ''}`}
          >
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='new-password'
              placeholder='Create a password'
              className='grow'
              {...register('password', {
                required: 'Please create a password',
                validate: validatePassword,
              })}
            />
            <button
              type='button'
              onClick={() => setShowPassword((show) => !show)}
              className='text-base-content/60 hover:text-base-content'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <HiOutlineEyeSlash className='size-5' />
              ) : (
                <HiOutlineEye className='size-5' />
              )}
            </button>
          </label>
          <PasswordChecklist value={password} />
        </FormField>

        {formError && (
          <div role='alert' className='alert alert-error alert-soft text-sm'>
            {formError}
          </div>
        )}

        <button
          type='submit'
          disabled={isSubmitting}
          className='btn btn-primary mt-2 w-full rounded-full'
        >
          {isSubmitting && (
            <span className='loading loading-spinner loading-sm' />
          )}
          Register
        </button>
      </form>

      <div className='divider my-0 text-sm text-base-content/50'>or</div>

      <GoogleButton callbackURL='/' label='Sign up with Google' />

      <p className='text-center text-sm text-base-content/70'>
        Already have an account?{' '}
        <Link
          href='/login'
          className='font-semibold text-primary hover:underline'
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
