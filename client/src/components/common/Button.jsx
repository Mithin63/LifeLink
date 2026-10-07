import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  icon: Icon,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:ring-red-500 shadow-red-600/20',
    emergency:
      'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:ring-red-500 shadow-red-600/30 btn-emergency-pulse',
    secondary:
      'bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 hover:-translate-y-0.5 focus:ring-slate-400',
    outline:
      'border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-slate-400',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-slate-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white shadow-sm hover:-translate-y-0.5 focus:ring-rose-500',
    success:
      'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white shadow-sm hover:-translate-y-0.5 focus:ring-emerald-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};
