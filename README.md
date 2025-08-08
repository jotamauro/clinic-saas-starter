# ClinicSaaS Starter (Extended)

MVP com Next.js (App Router), Tailwind, Prisma, Zod, NextAuth e PostgreSQL — **agora com telas CRUD**.

## Rodando localmente

```bash
cp .env.example .env
# edite DATABASE_URL, NEXTAUTH_URL e NEXTAUTH_SECRET

npm i
npm run db:migrate
npm run db:seed
npm run dev
```

Login padrão: **admin@clinic.com / admin123**

## Páginas
- `/dashboard`
- `/clinics` — criar e listar clínicas
- `/patients` — criar e listar pacientes
- `/doctors` — criar e listar médicos (mostra IDs de clínicas)
- `/contracts` — criar e listar contratos (mostra IDs de clínicas/médicos)
- `/schedule` — criar e listar slots de agenda
- `/appointments` — agendar e listar consultas (gera token/código de check-in)
- `/checkin/[token]` — check-in público por link
- `/checkin` — check-in por código

## APIs principais
- `GET/POST /api/clinics`
- `GET/POST /api/patients`
- `GET/POST /api/doctors`
- `GET/POST /api/contracts`
- `GET/POST /api/slots`
- `GET/POST /api/appointments`
- `POST /api/checkin` (token ou code)
# clinic-saas-starter
