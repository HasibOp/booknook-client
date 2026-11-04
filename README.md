# BookNook

**BookNook** is a small online library. Share the books on your shelf, borrow one for 7 days, and return it when you're done: add a book, borrow a book, return a book.

- **Live site:** https://booknook-hasibop.vercel.app
- **Server repo:** https://github.com/HasibOp/booknook-server ([live API](https://booknook-server-hasibop.vercel.app))

## Features

- **Borrow and return with live copy counts.** Every book has a total number of copies. Borrowing takes one copy and returning gives it back (MongoDB `$inc`). When none are left, the button changes to a disabled **Not Available**.
- **No double borrowing.** A reader can hold only one copy of a book at a time. Trying again shows an error toast, and the book page shows **Already Borrowed** with the return date.
- **Your own shelf.** Add books with a cover uploaded to imgbb, then edit them (the form opens pre-filled) or delete them after a custom confirm modal on **My Books**.
- **My Borrows with due dates.** See every borrowed book with its borrow and return dates, plus a _days left_, _due today_ or _overdue_ badge. Return a book in one click.
- **Login that remembers where you were going.** Sign up with email and password (checked for an uppercase letter, a lowercase letter and 6+ characters) or with Google. Private pages send you to log in and then straight back.
- **Secure API calls.** BetterAuth (MongoDB adapter) issues a short-lived JWT that the Express API checks on every protected route.
- **Find books fast.** All Books has search by title or author and a category filter, and the home page shows the 6 newest arrivals.
- **Comfortable everywhere.** Fully responsive, with a dark/light theme toggle that remembers your choice and gentle scroll animations (Motion).

## Pages

| Route                 | Access  | What's there                                                          |
| --------------------- | ------- | --------------------------------------------------------------------- |
| `/`                   | Public  | Swiper hero slider, New Arrivals, How Borrowing Works, Top Categories |
| `/books`              | Public  | All books in a 3-column grid, with search and category filter         |
| `/books/:id`          | Private | Full book details, who added it, copies left, Borrow modal            |
| `/add-book`           | Private | Add a book (cover upload, category, total copies)                     |
| `/my-books`           | Private | Your books, with Edit (`/my-books/edit/:id`) and Delete               |
| `/my-borrows`         | Private | Your borrowed books, with Return Book                                 |
| `/profile`            | Private | Your profile: update your name and photo                              |
| `/login`, `/register` | Public  | Email/password and Google sign-in                                     |
| `/privacy`            | Public  | Privacy policy                                                        |

Every route sets its own page title (for example _BookNook | All Books_), and unknown URLs show a custom 404 page.

## Tech stack

- **Next.js 16** (App Router) with **TypeScript**
- **Tailwind CSS 4** and **DaisyUI 5** (custom light and dark themes)
- **BetterAuth** with the **MongoDB adapter**, Google sign-in and the **JWT** plugin
- **TanStack Query** and **Axios** for API data, **React Hook Form** for forms
- **Swiper** for the slider, **Motion** for animations, **react-hot-toast** for messages
- **imgbb** for image hosting (uploaded through a protected Next.js route, so the API key stays on the server)

## Run it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The [server](https://github.com/HasibOp/booknook-server) needs to be running too (http://localhost:5000 by default).

### Environment variables

| Name                                       | Notes                                                                                       |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET`                       | A long random string                                                                        |
| `BETTER_AUTH_URL`                          | This app's URL, e.g. `http://localhost:3000` (must match the server's `CLIENT_URL`)         |
| `MONGODB_URI`, `DB_NAME`                   | The same MongoDB database the server uses                                                   |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | From Google Cloud Console. The redirect URI is `<BETTER_AUTH_URL>/api/auth/callback/google` |
| `IMGBB_API_KEY`                            | From https://api.imgbb.com                                                                  |
| `NEXT_PUBLIC_API_URL`                      | The server's URL, e.g. `http://localhost:5000`                                              |
