import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
  hover?: boolean;
  title?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
  onClick,
  hover = false,
  title,
}) => {
  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-[rgb(var(--surface))] rounded-2xl border border-[rgb(var(--border))] shadow-sm transition-all duration-300
        ${hover ? "hover:shadow-xl hover:shadow-[rgb(var(--accent)/0.15)] hover:-translate-y-1" : ""}
        ${onClick ? "cursor-pointer active:scale-[0.99]" : ""}
        ${paddings[padding]}
        ${className}
      `}
    >
      {title && (
        <h3 className="text-lg font-black text-[rgb(var(--text-primary))] mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
