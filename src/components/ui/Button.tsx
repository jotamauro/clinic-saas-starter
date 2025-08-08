import { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return <button {...rest} className={`rounded px-3 py-2 bg-blue-600 text-white disabled:opacity-50 ${className}`} />;
}
