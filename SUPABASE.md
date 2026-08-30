# Supabase setup — Doyintech Academy

## 1. Create project
1. https://supabase.com → New project
2. Copy Project URL and anon public key

## 2. Env
```bash
cp .env.example .env.local
# set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 3. Schema
SQL Editor → run entire file:
`supabase/migrations/20260330000000_init.sql`

## 4. Auth
Email provider ON. Disable confirm email for local dev if needed.

## 5. Packages
```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 6. Admin
```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

## 7. Run
```bash
npm run dev
```
