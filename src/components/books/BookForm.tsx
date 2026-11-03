'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HiOutlineCloudArrowUp, HiOutlinePhoto } from 'react-icons/hi2';
import FormField from '@/components/auth/FormField';
import { uploadImage, validateImageFile } from '@/lib/upload';
import { CATEGORIES, type BookInput, type Category } from '@/types';

type BookFormValues = {
  title: string;
  author: string;
  category: Category | '';
  image: FileList | null;
  description: string;
  totalCopies: number;
};

type BookFormProps = {
  user: { name: string; email: string };
  initial?: Partial<BookInput>;
  submitLabel: string;
  savingLabel: string;
  onSave: (data: BookInput) => Promise<void>;
};

const DESCRIPTION_MAX = 1000;

export default function BookForm({
  user,
  initial,
  submitLabel,
  savingLabel,
  onSave,
}: BookFormProps) {
  const [stage, setStage] = useState<'idle' | 'uploading' | 'saving'>('idle');
  const existingImage = initial?.image ?? '';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookFormValues>({
    defaultValues: {
      title: initial?.title ?? '',
      author: initial?.author ?? '',
      category: initial?.category ?? '',
      image: null,
      description: initial?.description ?? '',
      totalCopies: initial?.totalCopies ?? 1,
    },
  });

  const imageFiles = useWatch({ control, name: 'image' });
  const description = useWatch({ control, name: 'description' }) ?? '';
  const pickedFile = imageFiles?.[0] ?? null;

  const previewUrl = useMemo(
    () => (pickedFile ? URL.createObjectURL(pickedFile) : null),
    [pickedFile],
  );
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const shownImage = previewUrl ?? existingImage;
  const busy = stage !== 'idle';

  const onSubmit = async (values: BookFormValues) => {
    try {
      let image = existingImage;
      if (pickedFile) {
        setStage('uploading');
        try {
          image = await uploadImage(pickedFile);
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Image upload failed. Please try again.',
          );
          return;
        }
      }
      setStage('saving');
      await onSave({
        title: values.title.trim(),
        author: values.author.trim(),
        category: values.category as Category,
        image,
        description: values.description.trim(),
        totalCopies: Number(values.totalCopies),
      });
    } finally {
      setStage('idle');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className='grid gap-8 lg:grid-cols-[320px_1fr]'
    >
      <div className='flex flex-col gap-3'>
        <span className='text-sm font-semibold'>Book image</span>
        <label
          htmlFor='image'
          className={`group relative flex aspect-3/4 w-full cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-box border-2 border-dashed bg-base-200/60 text-center transition hover:border-primary ${
            errors.image ? 'border-error' : 'border-base-300'
          }`}
        >
          {shownImage ? (
            <>
              <Image
                src={shownImage}
                alt='Book cover preview'
                fill
                unoptimized={Boolean(previewUrl)}
                sizes='320px'
                className='object-cover'
              />
              <span className='absolute inset-x-3 bottom-3 rounded-full bg-neutral/80 px-3 py-2 text-xs font-semibold text-neutral-content opacity-0 transition group-hover:opacity-100'>
                Click to choose a different image
              </span>
            </>
          ) : (
            <>
              <span className='flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <HiOutlineCloudArrowUp className='size-7' />
              </span>
              <span className='px-6 text-sm font-semibold'>
                Click to upload a cover
              </span>
              <span className='px-6 text-xs text-base-content/60'>
                JPG, PNG, WEBP or GIF, up to 4 MB
              </span>
            </>
          )}
        </label>
        <input
          id='image'
          type='file'
          accept='image/jpeg,image/png,image/webp,image/gif'
          className='file-input file-input-sm w-full'
          {...register('image', {
            validate: (files) => {
              const file = files?.[0];
              if (!file)
                return existingImage ? true : 'Please choose a cover image.';
              return validateImageFile(file) ?? true;
            },
          })}
        />
        {errors.image?.message && (
          <p className='text-sm text-error' role='alert'>
            {errors.image.message}
          </p>
        )}
        {existingImage && !pickedFile && (
          <p className='flex items-center gap-2 text-xs text-base-content/60'>
            <HiOutlinePhoto className='size-4' />
            Keeping the current image. Choose a file only if you want to replace
            it.
          </p>
        )}
      </div>

      <div className='flex flex-col gap-4'>
        <FormField
          label='Book title'
          htmlFor='title'
          error={errors.title?.message}
        >
          <input
            id='title'
            type='text'
            placeholder='e.g. The Hobbit'
            className={`input w-full ${errors.title ? 'input-error' : ''}`}
            {...register('title', {
              validate: (value) => {
                const length = value.trim().length;
                if (!length) return 'Please enter the book title';
                return length <= 150 || 'Title must be at most 150 characters';
              },
            })}
          />
        </FormField>

        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            label='Author name'
            htmlFor='author'
            error={errors.author?.message}
          >
            <input
              id='author'
              type='text'
              placeholder='e.g. J.R.R. Tolkien'
              className={`input w-full ${errors.author ? 'input-error' : ''}`}
              {...register('author', {
                validate: (value) => {
                  const length = value.trim().length;
                  if (!length) return "Please enter the author's name";
                  return (
                    length <= 100 ||
                    'Author name must be at most 100 characters'
                  );
                },
              })}
            />
          </FormField>

          <FormField
            label='Category'
            htmlFor='category'
            error={errors.category?.message}
          >
            <select
              id='category'
              className={`select w-full ${errors.category ? 'select-error' : ''}`}
              {...register('category', { required: 'Please pick a category' })}
            >
              <option value='' disabled>
                Choose a category
              </option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField
          label='Short description'
          htmlFor='description'
          error={errors.description?.message}
        >
          <textarea
            id='description'
            rows={5}
            placeholder='What is this book about? A few sentences help readers decide.'
            className={`textarea w-full ${errors.description ? 'textarea-error' : ''}`}
            {...register('description', {
              validate: (value) => {
                const length = value.trim().length;
                if (length < 10) return 'Please write at least 10 characters';
                return (
                  length <= DESCRIPTION_MAX ||
                  `Description must be at most ${DESCRIPTION_MAX} characters`
                );
              },
            })}
          />
          <span
            className={`self-end text-xs ${description.length > DESCRIPTION_MAX ? 'text-error' : 'text-base-content/50'}`}
          >
            {description.length}/{DESCRIPTION_MAX}
          </span>
        </FormField>

        <FormField
          label='Total copies'
          htmlFor='totalCopies'
          error={errors.totalCopies?.message}
        >
          <input
            id='totalCopies'
            type='number'
            min={1}
            max={100}
            step={1}
            className={`input w-full sm:max-w-48 ${errors.totalCopies ? 'input-error' : ''}`}
            {...register('totalCopies', {
              valueAsNumber: true,
              validate: (value) =>
                (Number.isInteger(value) && value >= 1 && value <= 100) ||
                'Enter a whole number from 1 to 100',
            })}
          />
        </FormField>

        <div className='grid gap-4 rounded-box bg-base-200/60 p-4 sm:grid-cols-2'>
          <FormField label='Your name' htmlFor='ownerName'>
            <input
              id='ownerName'
              type='text'
              value={user.name}
              readOnly
              className='input w-full bg-base-200'
            />
          </FormField>
          <FormField label='Your email' htmlFor='ownerEmail'>
            <input
              id='ownerEmail'
              type='email'
              value={user.email}
              readOnly
              className='input w-full bg-base-200'
            />
          </FormField>
        </div>

        <button
          type='submit'
          disabled={busy}
          className='btn btn-primary btn-lg mt-2 rounded-full sm:w-fit sm:px-10'
        >
          {busy && <span className='loading loading-spinner loading-sm' />}
          {stage === 'uploading'
            ? 'Uploading image...'
            : stage === 'saving'
              ? savingLabel
              : submitLabel}
        </button>
      </div>
    </form>
  );
}
