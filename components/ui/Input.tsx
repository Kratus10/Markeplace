import React, { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: 'outline' | 'filled' | 'ghost';
  inputSize?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      variant = 'outline',
      inputSize = 'md',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      outline: 'border border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      filled: 'bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-blue-500',
      ghost: 'border border-transparent focus:border-blue-500 focus:ring-blue-500',
    };

    const sizeClasses = {
      sm: 'py-1.5 px-2.5 text-sm',
      md: 'py-2 px-3 text-base',
      lg: 'py-2.5 px-4 text-lg',
    };

    const hasIcon = !!icon;
    const iconSpacing = iconPosition === 'left' ? 'pl-10' : 'pr-10';
    const iconPositionClass = iconPosition === 'left' ? 'left-3' : 'right-3';

    return (
      <div className={clsx(fullWidth && 'w-full', className)}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {hasIcon && (
            <div className={`absolute inset-y-0 ${iconPositionClass} flex items-center pointer-events-none`}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={clsx(
              'block w-full rounded-md shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1',
              variantClasses[variant],
              sizeClasses[inputSize],
              hasIcon && iconSpacing,
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="mt-1 text-sm text-gray-500" id={`${id}-hint`}>
            {hint}
          </p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
