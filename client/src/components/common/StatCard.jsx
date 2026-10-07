import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  color = 'red',
  formatNumber = true,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Extract raw number if value is a number
  const numericValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, '')) || 0;

  useEffect(() => {
    if (isNaN(numericValue) || numericValue === 0) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 700; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = numericValue / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [numericValue, value]);

  const colorVariants = {
    red: {
      iconBg: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-100 dark:border-red-900/40',
      badge: 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40',
      badge: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
      badge: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40',
      badge: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400',
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40',
      badge: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400',
    },
  };

  const selectedColor = colorVariants[color] || colorVariants.red;

  const formattedDisplay =
    typeof displayValue === 'number' && formatNumber
      ? `${prefix}${displayValue.toLocaleString()}${suffix}`
      : `${prefix}${displayValue}${suffix}`;

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-subtle dark:shadow-dark-card hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedColor.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          {formattedDisplay}
        </div>

        {trend !== undefined && (
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            {trend >= 0 ? (
              <span className="inline-flex items-center font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +{trend}%
              </span>
            ) : (
              <span className="inline-flex items-center font-bold text-rose-600 dark:text-rose-400">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                {trend}%
              </span>
            )}
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              {trendLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
