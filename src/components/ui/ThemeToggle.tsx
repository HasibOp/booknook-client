'use client';

import { useSyncExternalStore } from 'react';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';
import { DARK_THEME, LIGHT_THEME, THEME_KEY } from '@/lib/theme';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

const getTheme = () =>
  document.documentElement.getAttribute('data-theme') ?? LIGHT_THEME;

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => null);
  const isDark = theme === DARK_THEME;

  const toggle = () => {
    const next = isDark ? LIGHT_THEME : DARK_THEME;
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  return (
    <button
      type='button'
      onClick={toggle}
      className='btn btn-ghost btn-circle'
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
    >
      {theme === null ? (
        <span className='size-5' />
      ) : isDark ? (
        <HiOutlineSun className='size-5 transition-transform duration-500 hover:rotate-90' />
      ) : (
        <HiOutlineMoon className='size-5 transition-transform duration-500 hover:-rotate-12' />
      )}
    </button>
  );
}
