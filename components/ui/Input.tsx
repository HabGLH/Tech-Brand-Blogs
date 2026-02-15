import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-[rgb(var(--text-primary))] transition-colors">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] group-focus-within:text-[rgb(var(--accent))] transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-xl shadow-sm outline-none transition-all duration-200
              ${leftIcon ? "pl-11" : ""}
              ${rightIcon ? "pr-11" : ""}
              ${
                error
                  ? "border-[rgb(var(--secondary))] focus:border-[rgb(var(--secondary))] focus:ring-2 focus:ring-[rgb(var(--secondary-soft)/0.35)]"
                  : "focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgb(var(--accent-soft)/0.25)]"
              }
              text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-muted))]
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] group-focus-within:text-[rgb(var(--accent))] transition-colors">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs font-medium text-[rgb(var(--secondary))] animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
