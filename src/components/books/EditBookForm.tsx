"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { apiErrorMessage, secureApi } from "@/lib/api";
import { bookQuery, isMissing } from "@/lib/queries";
import type { Book, BookInput } from "@/types";
import BookForm from "./BookForm";

type EditBookFormProps = {
  id: string;
  user: { name: string; email: string };
};

export default function EditBookForm({ id, user }: EditBookFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: book, error, isPending } = useQuery({ ...bookQuery(id), staleTime: 0 });

  if (isPending) return <Spinner label="Loading the book..." />;

  if (error) {
    return isMissing(error) ? (
      <EmptyState
        title="Book not found"
        text="This book may have been removed, or the link is not quite right."
        actionHref="/my-books"
        actionLabel="Back to My Books"
      />
    ) : (
      <div role="alert" className="alert alert-warning alert-soft mx-auto max-w-xl justify-center text-center">
        {apiErrorMessage(error, "We couldn't load this book right now.")}
      </div>
    );
  }

  if (book.addedBy.email !== user.email) {
    return (
      <EmptyState
        title="This isn't your book"
        text="You can only edit books that you added to BookNook."
        actionHref="/my-books"
        actionLabel="Back to My Books"
      />
    );
  }

  const handleSave = async (data: BookInput) => {
    try {
      const { data: updated } = await secureApi.patch<Book>(`/books/${id}`, data);
      queryClient.setQueryData(["book", id], updated);
      await queryClient.invalidateQueries({ queryKey: ["my-books"] });
      toast.success(`"${updated.title}" has been updated.`);
      router.push("/my-books");
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not save your changes. Please try again."));
      await queryClient.invalidateQueries({ queryKey: ["book", id] });
    }
  };

  return (
    <BookForm
      user={user}
      initial={book}
      minCopies={Math.max(1, book.totalCopies - book.availableCopies)}
      submitLabel="Save Changes"
      savingLabel="Saving changes..."
      onSave={handleSave}
    />
  );
}
