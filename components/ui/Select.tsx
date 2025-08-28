import React, { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

const Select: React.FC<SelectProps> = ({ 
  options = [], 
  label,
  error,
  hint,
  fullWidth = false, 
  className,
  value,
  onChange,
  ...props 
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`block w-full px-3 py-2 border ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        } rounded-md shadow-sm focus:outline-none text-base ${fullWidth ? 'w-full' : ''} ${className || ''}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
