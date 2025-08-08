"use client";
import { z, ZodTypeAny } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function ZForm<T extends ZodTypeAny>({
  schema, onSubmit, fields, submitLabel = "Salvar"
}: {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void>|void;
  fields: Array<{ name: keyof z.infer<T> & string; label: string; type?: string; }>
  submitLabel?: string;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<T>>({ resolver: zodResolver(schema) });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      {fields.map(f => (
        <div key={f.name} className="grid gap-1">
          <label className="text-sm">{f.label}</label>
          <input {...register(f.name as any)} type={f.type ?? "text"} className="rounded border px-3 py-2" />
          {errors[f.name] && <span className="text-xs text-red-600">{(errors[f.name]?.message as any) ?? "Campo inválido"}</span>}
        </div>
      ))}
      <button disabled={isSubmitting} className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50">
        {submitLabel}
      </button>
    </form>
  );
}
