import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  className?: string;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "secondary",
  className = "",
  onClick,
}) => {
  const variants = {
    primary: "bg-[rgb(var(--primary)/0.18)] text-[rgb(var(--primary-strong))]",
    secondary:
      "bg-[rgb(var(--surface-elevated))] text-[rgb(var(--text-muted))]",
    success: "bg-[rgb(var(--accent-soft)/0.28)] text-[rgb(var(--accent))]",
    warning: "bg-[rgb(245_158_11/0.18)] text-[rgb(180_83_9)]",
    danger: "bg-[rgb(var(--secondary-soft)/0.3)] text-[rgb(var(--secondary))]",
    info: "bg-[rgb(var(--primary)/0.16)] text-[rgb(var(--primary-strong))]",
  };

  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
        ${variants[variant]}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
