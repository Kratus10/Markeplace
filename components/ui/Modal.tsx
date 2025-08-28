import React, { forwardRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import Button from './Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'center' | 'top';
  disableClickOutsideClose?: boolean;
  disableEscapeClose?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  className?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      actions,
      size = 'md',
      position = 'center',
      disableClickOutsideClose = false,
      disableEscapeClose = false,
      initialFocusRef,
      className,
    },
    ref
  ) => {
    const [isMounted, setIsMounted] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle mount/unmount for animations
    useEffect(() => {
      if (isOpen) {
        setIsMounted(true);
      }
    }, [isOpen]);

    // Handle escape key to close
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen && !disableEscapeClose) {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, disableEscapeClose]);

    // Set focus to modal when opened
    useEffect(() => {
      if (isOpen && modalRef.current) {
        if (initialFocusRef && initialFocusRef.current) {
          initialFocusRef.current.focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, [isOpen, initialFocusRef]);

    // Prevent body scroll when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
      
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, [isOpen]);

    // Handle outside click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (
        !disableClickOutsideClose && 
        modalRef.current && 
        !modalRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    };

    const positionClasses = {
      center: 'items-center',
      top: 'items-start mt-20',
    };

    if (!isOpen && !isMounted) return null;

    return createPortal(
      <div
        className={clsx(
          'fixed inset-0 z-50 flex justify-center overflow-y-auto',
          positionClasses[position],
          isOpen
            ? 'opacity-100 transition-opacity duration-300 ease-in-out'
            : 'opacity-0 pointer-events-none'
        )}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
      >
        <div
          className={clsx(
            'fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden="true"
        />
        
        <div
          ref={modalRef}
          className={clsx(
            'relative bg-white rounded-lg shadow-xl w-full mx-4 my-8 transform',
            sizeClasses[size],
            isOpen
              ? 'scale-100 transition-transform duration-300 ease-in-out'
              : 'scale-95 pointer-events-none',
            className
          )}
          tabIndex={-1}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
              <XMarkIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="p-6">{children}</div>
          
          {actions && (
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              {actions}
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
