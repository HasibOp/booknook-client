'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiErrorMessage, secureApi } from '@/lib/api';
import type { Book, BookInput } from '@/types';
import BookForm from './BookForm';

export default function AddBookForm({
  user,
}: {
  user: { name: string; email: string };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSave = async (data: BookInput) => {
    try {
      const { data: book } = await secureApi.post<Book>('/books', data);
      toast.success(`"${book.title}" is now on the BookNook shelves!`);
      await queryClient.invalidateQueries({ queryKey: ['my-books'] });
      router.push('/my-books');
    } catch (error) {
      toast.error(
        apiErrorMessage(error, 'Could not add the book. Please try again.'),
      );
    }
  };

  return (
    <BookForm
      user={user}
      submitLabel='Add Book'
      savingLabel='Adding book...'
      onSave={handleSave}
    />
  );
}
