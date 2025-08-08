"use client";
import { useEffect, useState } from "react";

type Option = { value: string; label: string };

export function AsyncSelect({
  url,
  map,
  name,
  onChange,
  placeholder = "Selecione...",
  className = "",
  value
}: {
  url: string;
  map: (item: any) => Option;
  name?: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [opts, setOpts] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        setOpts(data.map(map));
      } finally {
        setLoading(false);
      }
    })();
  }, [url, map]);

  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`rounded border px-3 py-2 ${className}`}
    >
      <option value="">{loading ? "Carregando..." : placeholder}</option>
      {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
