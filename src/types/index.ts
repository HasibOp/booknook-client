export const CATEGORIES = [
  'Fiction',
  'Science',
  'History',
  'Kids',
  'Others',
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: Category;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedBy: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
};

export type BookInput = Pick<
  Book,
  'title' | 'author' | 'category' | 'image' | 'description' | 'totalCopies'
>;

export type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
};
