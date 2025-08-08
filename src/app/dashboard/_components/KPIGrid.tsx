// src/app/dashboard/_components/KPIGrid.tsx
"use client";

type Counts = { clinics: number; patients: number; appointments: number; contracts: number };

const items = (c: Counts) => [
    { label: "Clínicas", value: c.clinics, gradient: "from-emerald-500/70 to-teal-500/60" },
    { label: "Pacientes", value: c.patients, gradient: "from-violet-500/70 to-fuchsia-500/60" },
    { label: "Consultas", value: c.appointments, gradient: "from-blue-500/70 to-cyan-500/60" },
    { label: "Contratos", value: c.contracts, gradient: "from-amber-500/70 to-orange-500/60" },
];

export default function KPIGrid({ counts }: { counts: Counts }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items(counts).map((it) => (
                <KpiCard key={it.label} label={it.label} value={it.value} gradient={it.gradient} />
            ))}
        </div>
    );
}

function KpiCard({ label, value, gradient }: { label: string; value: number; gradient: string }) {
    return (
        <div
            className={[
                "relative overflow-hidden rounded-2xl p-4",
                "bg-white/60 dark:bg-neutral-900/50",
                "backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10",
                "shadow-sm hover:shadow-md transition-shadow",
            ].join(" ")}
            role="status"
            aria-label={`${label}: ${value}`}
        >
            {/* Gradiente com transparência */}
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-40`} />
            {/* Pattern sutil opcional */}
            <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(1200px_600px_at_-10%_-20%,black,transparent)] bg-white/10" />

            <div className="relative">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">{label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {Intl.NumberFormat("pt-BR").format(value)}
                </p>
            </div>
        </div>
    );
}
