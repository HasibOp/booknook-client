'use client';

import { useEffect, useRef } from 'react';
import type { IconType } from 'react-icons';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

type ConfirmModalProps = {
  title: string;
  children: React.ReactNode;
  confirmLabel: string;
  pendingLabel: string;
  pending: boolean;
  tone?: 'error' | 'primary';
  icon?: IconType;
  onConfirm: () => void;
  onClose: () => void;
};

const tones = {
  error: { badge: 'bg-error/10 text-error', button: 'btn-error' },
  primary: { badge: 'bg-primary/10 text-primary', button: 'btn-primary' },
};

export default function ConfirmModal({
  title,
  children,
  confirmLabel,
  pendingLabel,
  pending,
  tone = 'error',
  icon: Icon = HiOutlineExclamationTriangle,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const requestClose = () => {
    if (!pending) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className='modal modal-bottom sm:modal-middle'
      aria-labelledby='confirm-title'
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
    >
      <div className='modal-box flex max-w-md flex-col items-center gap-4 p-6 text-center sm:p-8'>
        <span
          className={`flex size-16 items-center justify-center rounded-full ${tones[tone].badge}`}
        >
          <Icon className='size-8' />
        </span>
        <h2 id='confirm-title' className='text-2xl font-semibold'>
          {title}
        </h2>
        <div className='text-base-content/70'>{children}</div>
        <div className='modal-action mt-2 w-full flex-col-reverse gap-2 sm:flex-row sm:justify-center'>
          <button
            type='button'
            onClick={requestClose}
            disabled={pending}
            className='btn btn-ghost rounded-full px-6'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={pending}
            className={`btn rounded-full px-6 ${tones[tone].button}`}
          >
            {pending && <span className='loading loading-spinner loading-sm' />}
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
      <div className='modal-backdrop'>
        <button
          type='button'
          onClick={requestClose}
          aria-label='Close'
          tabIndex={-1}
        >
          close
        </button>
      </div>
    </dialog>
  );
}
