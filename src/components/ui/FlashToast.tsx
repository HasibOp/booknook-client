'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { takeFlash } from '@/lib/flash';

export default function FlashToast() {
  useEffect(() => {
    const flash = takeFlash();
    if (!flash) return;
    if (flash.type === 'success') toast.success(flash.message);
    else toast.error(flash.message);
  }, []);

  return null;
}
