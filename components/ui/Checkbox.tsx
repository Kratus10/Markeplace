// FILE: components/ui/Checkbox.tsx
import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  onChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.checked);
      }
    };

    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className={clsx(
            'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500',
            className
          )}
          onChange={handleChange}
          {...props}
        />
        {label && (
          <label htmlFor={props.id} className="ml-2 block text-sm text-gray-900">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
