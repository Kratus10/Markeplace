"use client";

import React, { forwardRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled = false,
      onClick,
      href,
      type = 'button',
      className,
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const isDisabled = loading || disabled;

    // Variant styles using our global classes
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      link: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:outline-none',
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600',
    };
    
    // Size styles
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-5 py-2.5 text-base rounded-lg',
      xl: 'px-6 py-3 text-base rounded-lg',
    };
    
    // Icon spacing
    const iconSpacing = {
      left: 'mr-2',
      right: 'ml-2',
    };

    const handleClick = () => {
      if (onClick) {
        onClick();
      }
    };

    const baseClass = clsx(
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-60',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    );

    const content = (
      <>
        {icon && iconPosition === 'left' && (
          <span className={clsx({ [iconSpacing.left]: children })}>
            {icon}
          </span>
        )}
        
        {children}
        
        {icon && iconPosition === 'right' && (
          <span className={clsx({ [iconSpacing.right]: children })}>
            {icon}
          </span>
        )}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={baseClass}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...props}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        type={type}
        className={baseClass}
        onClick={handleClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
