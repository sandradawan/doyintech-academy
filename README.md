# Doyintech Academy

Learn to code with short videos, written lessons, interactive exercises, quizzes, and a named certificate.

A school from [DoyinTech](https://doyintech.vercel.app).

## Features

- Course catalog with sequential module unlocking
- Student accounts (Supabase Auth)
- Dashboard with progress tracking
- Quizzes (60% pass threshold) and named certificates
- Paystack-gated certificate download
- Admin CRM (protected, role-based)
- Homepage waitlist for first cohort
- Code playground

## Stack

Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Supabase (Auth + Postgres + Realtime), Paystack.

## Getting started

```bash
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# PAYSTACK_SECRET_KEY, NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
npm run dev
```

See `SUPABASE.md` for database setup and admin role assignment.

## Security notes

- Admin UI is not at `/admin`. The public path is controlled by `NEXT_PUBLIC_ADMIN_PATH` (default `/dt-ops-console`).
- Never commit real secrets. Use environment variables and Vercel/Supabase secrets.
- Certificate issuance and quiz scoring must go through server-side RPCs only.

## Contact

DoyinTech · doyintechnology@gmail.com
