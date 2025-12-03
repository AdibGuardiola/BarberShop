"use client";

import React from "react";
import { usePreferences } from "@/context/PreferencesContext";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

function cx(base: string, extra?: string) {
  return base + (extra ? " " + extra : "");
}

export function Card(props: CardProps) {
  const { theme } = usePreferences();
  const isDark = theme === "dark";
  const base = isDark
    ? "rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-lg shadow-black/40"
    : "rounded-2xl border border-slate-200 bg-white p-6 shadow-md";

  return (
    <div {...props} className={cx(base, props.className)}>
      {props.children}
    </div>
  );
}

export function CardHeader(props: CardProps) {
  return <div {...props} className={cx("mb-3", props.className)}>{props.children}</div>;
}

export function CardTitle(props: CardProps) {
  return (
    <h2
      {...props}
      className={cx("text-xl font-semibold leading-none", props.className)}
    >
      {props.children}
    </h2>
  );
}

export function CardContent(props: CardProps) {
  return <div {...props} className={props.className}>{props.children}</div>;
}
