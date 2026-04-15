# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server on port 4200
npm run build    # Production build
npm run lint     # Run ESLint
```

There are no test commands — this project has no test suite.

## Architecture

This is a **Next.js 16 App Router** ERP frontend with multi-tenancy and role-based routing.

### Route structure

All routes are under `src/app/[locale]/` (i18n via `next-intl`, locales: `es` / `en`, default `es`).

Three route groups with distinct layouts:
- `(dashboard)` — admin/manager views: dashboard, empleados, inventario, ordenes
- `(super-admin)` — super-admin-only views: empresas, usuarios
- `(employee)` — staff-only view: mis-ordenes
- `(auth)` — public login page

### Auth & middleware

`src/proxy.ts` (actually the middleware) enforces role-based access using two cookies: `auth_token` and `user_role`. Roles: `super_admin`, `staff`, `manager`, `admin`, `owner`. On login, `useAuthStore` (`src/store/auth.ts`, Zustand + persist) stores the token in both `localStorage` and the `auth_token` cookie.

### API layer

`src/lib/api.ts` — a single Axios instance (`apiClient`) with two interceptors:
1. **Request**: injects `Authorization: Bearer <token>`, `locale` header, and `X-Company-Id` header from `localStorage`.
2. **Response**: maps HTTP error codes to i18n toast messages; on 401 with an existing token it clears auth and redirects to `/login`.

All backend calls go through `NEXT_PUBLIC_API_URL` (required env var).

### Data fetching pattern

- **Services** (`src/services/`) — thin wrappers around `apiClient` that return typed promises. Follow the object-of-functions pattern: `inventoryService.list(...)`, `companiesService.create(...)`.
- **Hooks** (`src/hooks/`) — wrap service calls with `useQuery`/`useMutation` from TanStack Query. Work-order hooks (`src/hooks/use-work-orders.ts`) inline the API calls rather than delegating to a service.
- `src/lib/query.ts` — shared `QueryClient` (5 min stale time, 1 retry).

### Component conventions

- `src/components/ui/` — shadcn/ui primitives (Button, Dialog, Sheet, DataTable, etc.)
- `src/components/<domain>/` — feature components: `columns.tsx` (TanStack Table column defs), `<entity>-form.tsx` (react-hook-form + zod), `<entity>-delete-dialog.tsx`
- `src/components/layout/` — shell components (Sidebar, Header, SidebarProvider context)

### i18n

Message files: `messages/es.json` and `messages/en.json`. Use `useTranslations()` in client components. For server-side error messages in the API interceptor, `src/lib/api-i18n.ts` provides `getApiT()` and `getLocale()`.

### State

Global state is only used for auth (`useAuthStore`). All server data lives in TanStack Query cache. No Redux or other global stores.
