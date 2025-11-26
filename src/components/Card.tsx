import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card(props: CardProps) {
  return (
    <div
      className={
        "rounded-2xl border border-slate-200/20 bg-white/10 p-6 shadow backdrop-blur " +
        (props.className || "")
      }
      {...props}
    >
      {props.children}
    </div>
  );
}

export function CardHeader(props: CardProps) {
  return (
    <div
      className={"mb-3 " + (props.className || "")}
      {...props}
    >
      {props.children}
    </div>
  );
}

export function CardTitle(props: CardProps) {
  return (
    <h2
      className={
        "text-xl font-semibold leading-none " + (props.className || "")
      }
      {...props}
    >
      {props.children}
    </h2>
  );
}

export function CardContent(props: CardProps) {
  return (
    <div className={props.className || ""} {...props}>
      {props.children}
    </div>
  );
}
