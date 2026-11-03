import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { themeScript } from '@/lib/theme';
import Providers from '@/providers/Providers';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'BookNook | Home',
    template: 'BookNook | %s',
  },
  description:
    'BookNook is a small online library where you can add, borrow and return books.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      data-theme='booknook'
      suppressHydrationWarning
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className='flex min-h-full flex-col'>
        <Providers>
          <Navbar />
          <main className='flex flex-1 flex-col'>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
