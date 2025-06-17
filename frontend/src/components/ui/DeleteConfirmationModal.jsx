import React, { useEffect, useState } from 'react';
import ScrollLockOverlay from '@/components/ui/ScrollLockOverlay';
import PrimaryButton from '@/components/ui/PrimaryButton';
import BackCancelButton from '@/components/ui/BackCancelButton';
import ModalPortal from '@/components/ui/ModalPortal';

/**
 * Generic modal for confirming destructive actions like delete/remove.
 *
 * Props:
 * - title: (string) Modal title.
 * - description: (string|ReactNode) Modal description.
 * - confirmLabel: (string) Confirm button text (default "Delete").
 * - confirmColor: (string) Tailwind bg class for confirm (default 'bg-red-600').
 * - onClose: (function) Called when modal closes.
 * - onConfirm: (function) Called on confirm, supports async.
 * - loading: (boolean) External loader, or will manage internally if not provided.
 */
export default function DeleteConfirmationModal({
  title = 'Are you sure?',
  description = '',
  confirmLabel = 'Delete',
  confirmColor = 'bg-red-600',
  onClose,
  onConfirm,
  loading: externalLoading,
}) {
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleConfirm = async () => {
    if (externalLoading !== undefined) {
      onConfirm?.();
      return;
    }
    setLoading(true);
    await onConfirm?.();
    setLoading(false);
  };

  const handleCloseWithFade = () => {
    setFadeIn(false);
    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  const isLoading = externalLoading !== undefined ? externalLoading : loading;

  return (
    <ModalPortal>
      <ScrollLockOverlay
        open
        fadeIn={fadeIn}
        onClick={handleCloseWithFade}
      />
      <div className='fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none'>
        <div
          className={`
            bg-white rounded-3xl shadow-lg p-8 w-full max-w-[40rem] pointer-events-auto
            transition-opacity duration-200
            ${fadeIn ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <h3 className='text-3xl font-extrabold mb-4 text-gray-900'>{title}</h3>
          {description && <div className='mb-8 text-base text-gray-700'>{description}</div>}
          <div className='flex gap-3 justify-end mt-6'>
            <BackCancelButton
              onClick={handleCloseWithFade}
              text='Cancel'
              disabled={isLoading}
            />
            <PrimaryButton
              onClick={handleConfirm}
              bgcolor={confirmColor}
              loading={isLoading}
              disabled={isLoading}
            >
              {confirmLabel}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
