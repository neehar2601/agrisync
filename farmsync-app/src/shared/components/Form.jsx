// Form components
import React from 'react';

export const FormField = ({ label, type = 'text', value, onChange, required = false, options = [], ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === 'select' ? (
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
        {...props}
      >
        <option value="">-- Select {label} --</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
        rows={4}
        {...props}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
        {...props}
      />
    )}
  </div>
);

export const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium', 
  icon = null, 
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-xl shadow-md transition-all duration-200 flex items-center justify-center space-x-2';
  
  const variants = {
    primary: 'bg-green-500 text-white hover:bg-green-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
  };
  
  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3',
    large: 'px-6 py-4 text-lg'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <>
          {icon && <span className="text-xl">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
