# Supabase setup — Doyintech Academy

## 1. Create project
1. https://supabase.com → New project
2. Copy Project URL and anon public key

## 2. Env
```bash
cp .env.example .env.local
# set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
# set PAYSTACK keys for certificate payments
```

## 3. Schema
SQL Editor → run migration files in order under `supabase/migrations/`.

## 4. Auth
- Email provider ON.
- Enable MFA (TOTP) for any account that will be granted `role = 'admin'`.
- Disable confirm email only for local development if needed.

## 5. Packages
```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 6. Admin role
Grant admin only to trusted accounts:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Never share admin credentials. Prefer individual accounts + MFA.

## 7. RLS checklist (critical)
- Students may only read/update their own `profiles`, `enrollments`, `lesson_progress`, `quiz_attempts`.
- Only security-definer RPCs may issue certificates or change payment status.
- Admin-only tables (`admin_activity`, full student lists, content overrides) must require `role = 'admin'`.
- Review every `SECURITY DEFINER` function for `auth.uid()` / role checks.

## 8. Run
```bash
npm run dev
```
