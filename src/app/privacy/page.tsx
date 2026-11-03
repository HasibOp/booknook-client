import type { Metadata } from 'next';
import SectionHeading from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'What information BookNook collects, how it is used and how to have it deleted.',
};

const contactEmail = 'hello@booknook.app';

const sections: {
  title: string;
  intro?: string;
  items?: string[];
  paragraphs?: string[];
}[] = [
  {
    title: 'Who we are',
    paragraphs: [
      'BookNook is a small online library where readers share the books on their shelf and borrow books from each other. This policy explains what information we collect when you use BookNook, why we need it and what you can do about it.',
    ],
  },
  {
    title: 'Information we collect',
    items: [
      'Account details: your name, email address and, if you add one, a profile photo. Passwords are never stored as plain text, only as a secure hash.',
      'Google sign-in: if you continue with Google, Google shares your name, email address and profile picture with us. We never see your Google password and get no access to your other Google data.',
      'Books you add: the details you enter, such as title, author, category, description and cover image, together with your name and email as the person who added the book.',
      'Borrow records: which books you borrow and their borrow and return dates.',
      'Cookies and browser storage: a session cookie keeps you signed in, and your light or dark theme choice is saved in your browser. We use no advertising or tracking cookies.',
    ],
  },
  {
    title: 'How we use your information',
    items: [
      'To create your account, sign you in and keep your account secure.',
      'To show your books, your borrows and their return dates.',
      'To let other readers see which books are on BookNook and who shared them.',
      'To answer you when you contact us.',
    ],
    paragraphs: [
      'We do not sell or rent your information, and we do not show ads.',
    ],
  },
  {
    title: 'Services we rely on',
    intro:
      'BookNook runs on a few trusted services, and each one only gets what it needs to do its job:',
    items: [
      'Vercel hosts the website and the API.',
      'MongoDB Atlas stores accounts, books and borrow records.',
      'Google handles "Continue with Google" sign-in.',
      'imgbb hosts the cover images you upload. Anyone with an image link can view that image.',
    ],
  },
  {
    title: 'Keeping and deleting your data',
    paragraphs: [
      `We keep your information for as long as your account exists. You can edit or delete the books you added at any time from My Books. To delete your account and everything linked to it, email us at ${contactEmail} from the address you signed up with, and we will remove it.`,
    ],
  },
  {
    title: 'Security',
    paragraphs: [
      'All traffic to BookNook uses HTTPS, passwords are hashed, and every request that changes your data must carry a signed token that proves it came from you.',
    ],
  },
  {
    title: 'Children',
    paragraphs: [
      'BookNook is not meant for children under 13 to use on their own. A parent or guardian should create and manage the account.',
    ],
  },
  {
    title: 'Changes to this policy',
    paragraphs: [
      'If we change how we handle your information, we will update this page and the date at the top.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <section className='container-page section-space'>
      <SectionHeading
        eyebrow='Last updated 4 November 2026'
        title='Privacy Policy'
        subtitle='Your reading life is your business. Here is exactly what BookNook keeps and why.'
      />
      <article className='mx-auto flex max-w-3xl flex-col gap-10'>
        {sections.map(({ title, intro, items, paragraphs }) => (
          <div key={title} className='flex flex-col gap-3'>
            <h3 className='text-2xl font-semibold'>{title}</h3>
            {intro && (
              <p className='leading-relaxed text-base-content/80'>{intro}</p>
            )}
            {items && (
              <ul className='flex list-disc flex-col gap-2 pl-5 leading-relaxed text-base-content/80'>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {paragraphs?.map((paragraph) => (
              <p
                key={paragraph}
                className='leading-relaxed text-base-content/80'
              >
                {paragraph}
              </p>
            ))}
          </div>
        ))}
        <div className='flex flex-col gap-3 rounded-box bg-base-200 p-6'>
          <h3 className='text-2xl font-semibold'>Contact us</h3>
          <p className='leading-relaxed text-base-content/80'>
            Questions about your privacy? Write to{' '}
            <a
              href={`mailto:${contactEmail}`}
              className='link link-secondary font-semibold'
            >
              {contactEmail}
            </a>
            .
          </p>
        </div>
      </article>
    </section>
  );
}
