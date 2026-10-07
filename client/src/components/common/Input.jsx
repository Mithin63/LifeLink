import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const Input = ({
  label,
  error,
  success = false,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          required={required}
          className={`w-full rounded-xl bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 text-sm transition-all duration-150 py-2.5 px-3.5 focus:outline-none focus:ring-2 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-500 dark:border-rose-500 focus:ring-rose-500/30 focus:border-rose-500 animate-shake'
              : success
              ? 'border-emerald-500 dark:border-emerald-500 focus:ring-emerald-500/30 focus:border-emerald-500'
              : 'border-slate-300 dark:border-slate-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20'
          } ${className}`}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-rose-500">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
        {success && !error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-emerald-500">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export const Select = ({
  label,
  error,
  helperText,
  icon: Icon,
  children,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          required={required}
          className={`w-full rounded-xl bg-white dark:bg-slate-900 border text-slate-900 dark:text-slate-100 text-sm transition-all duration-150 py-2.5 px-3.5 focus:outline-none focus:ring-2 ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-500 dark:border-rose-500 focus:ring-rose-500/30 focus:border-rose-500 animate-shake'
              : 'border-slate-300 dark:border-slate-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
};
