import React from "react";
import { Loader2 } from "lucide-react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] focus:ring-offset-2 focus:ring-offset-[rgb(var(--background))] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
    const variants = {
      primary:
        "bg-[rgb(var(--primary))] text-[rgb(var(--on-primary))] hover:bg-[rgb(var(--primary-strong))] shadow-md hover:shadow-lg hover:shadow-[rgb(var(--primary)/0.25)]",
      secondary:
        "bg-[rgb(var(--surface-elevated))] text-[rgb(var(--text-primary))] border border-[rgb(var(--border))] hover:border-[rgb(var(--secondary-soft))] hover:text-[rgb(var(--secondary))]",
      danger:
        "bg-[rgb(var(--secondary))] text-[rgb(var(--on-primary))] hover:bg-[rgb(var(--secondary-soft))] hover:text-[rgb(var(--text-primary))] shadow-md hover:shadow-lg hover:shadow-[rgb(var(--secondary)/0.25)]",
      ghost:
        "bg-transparent text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--surface-elevated))] hover:text-[rgb(var(--secondary))]",
      outline:
        "bg-transparent border-2 border-[rgb(var(--border))] text-[rgb(var(--text-primary))] hover:border-[rgb(var(--accent-soft))] hover:text-[rgb(var(--accent))] hover:bg-[rgb(var(--surface-elevated))]",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2.5",
    };
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {" "}
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {" "}
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}{" "}
            {children}{" "}
            {rightIcon && (
              <span className="flex-shrink-0">{rightIcon}</span>
            )}{" "}
          </>
        )}{" "}
      </button>
    );
  },
);
Button.displayName = "Button";
export default Button;
