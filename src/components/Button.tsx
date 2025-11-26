import React from "react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export default function Button(props: ButtonProps) {
  const variant: ButtonVariant = props.variant || "primary";
  const size: ButtonSize = props.size || "md";

  // estilos comunes a todos los botones
  const base =
    "inline-flex items-center justify-center font-semibold rounded-full transition-colors text-xl";

  // estilos según el tipo de botón
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-green-600 text-white hover:bg-red-500 focus:ring-red-400",
    outline: "bg-transparent border border-white text-white",
    ghost: "bg-transparent text-white hover:bg-white/10",
  };

  // tamaños
  const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-2xl",
  };

  return (
    <button
      {...props}
      className={
        base +
        " " +
        variants[variant] + // 👈 aquí usamos `variant`
        " " +
        sizes[size] +
        " " +
        (props.className || "")
      }
    >
      {props.children}
    </button>
  );
}
