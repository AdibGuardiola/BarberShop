"use client";

import React from "react";
import { usePreferences } from "@/context/PreferencesContext";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
};

export default function Button({
  children,
  variant = "primary",
  ...props
}: ButtonProps) {
  const { theme } = usePreferences();
  const isDark = theme === "dark";

  const base =
    "px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-cyan-500";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: isDark
      ? "bg-cyan-500 text-slate-900 hover:bg-cyan-400"
      : "bg-cyan-600 text-white hover:bg-cyan-700",
    secondary: isDark
      ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
      : "bg-slate-200 text-slate-900 hover:bg-slate-300",
    outline: isDark
      ? "border border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800"
      : "border border-slate-300 bg-transparent text-slate-800 hover:bg-slate-100",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
