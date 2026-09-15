# HireHub Job Portal

HireHub is a portfolio-ready job portal. The repository contains the original WordPress/PHP implementation plus a **Vercel-ready Next.js demo** for fast public hosting.

## Vercel version

The Next.js app lives in `app/` and can be deployed directly to Vercel.

### Features

- Modern responsive job-search interface
- Job title, company, location and category filtering
- Job detail/application modal
- Candidate application workflow
- **Authentication page at `/auth`**
- Login and registration UI
- Candidate and Recruiter role selection
- **Role-based authorization dashboard at `/dashboard`**
- Protected dashboard redirect for unauthenticated users
- Logout/session handling
- TypeScript + React + Next.js
- Zero external database required for the demo

### Authentication & Authorization

The Vercel demo includes a frontend authentication/authorization flow:

- `/auth` — login/register page
- Candidate — candidate-specific dashboard permissions
- Recruiter — recruiter-specific dashboard permissions
- `/dashboard` — checks the current session and redirects to `/auth` when no session exists
- Logout removes the current HireHub session
- Dashboard actions and permission cards are rendered according to the selected role

**Important:** this is a portfolio/demo implementation using browser `localStorage`; it is not production-grade authentication. For production, use server-side authentication such as Auth.js/NextAuth or an identity provider, persist users in a database, hash passwords securely, use HTTP-only cookies, and enforce authorization on server/API routes.

### Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Deploy to Vercel

Import this GitHub repository into Vercel. Framework preset: **Next.js**. Build command: `next build` (or the Vercel default). No environment variables are required for the demo.

## Original WordPress implementation

The original implementation remains under `wp-content/` and demonstrates WordPress-specific development:

- Custom WordPress theme
- Custom HireHub Core plugin
- Job custom post type
- Candidate and Recruiter roles
- Applications database table
- AJAX job search
- REST API endpoint
- Nonces, sanitization, escaping and capability checks
- Resume upload workflow

For a production system, the Next.js frontend should be connected to a persistent backend/database or WordPress REST API rather than relying on demo in-memory state.

## Portfolio talking points

HireHub demonstrates the ability to work across a CMS-based PHP stack and a modern React/Next.js frontend. The project now also demonstrates authentication UX, role selection, protected dashboard routing and role-based authorization concepts.
