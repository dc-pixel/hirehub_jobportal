# HireHub Job Portal

HireHub is a portfolio-ready recruitment platform with two implementations in one repository:

1. **Vercel-ready Next.js demo** in `app/` for public hosting.
2. **Original WordPress/PHP implementation** in `wp-content/` for demonstrating WordPress development.

## Next.js / Vercel demo

### Features

- Responsive job-search homepage
- Keyword, company, skill, location and category filtering
- Job details and application modal
- Candidate registration/login
- Recruiter registration/login
- Role-based authorization
- Protected dashboard route
- Candidate application tracking
- Resume filename capture and cover letter
- Save/unsave jobs
- Recruiter job creation and removal
- Recruiter applicant management
- Application status workflow: Applied → Shortlisted → Interview → Selected/Rejected
- Admin dashboard with platform job/application visibility
- Local browser persistence so the demo works without external services
- TypeScript + React + Next.js

### Demo authentication

Admin account:

- Email: `admin@hirehub.demo`
- Password: `Admin@123`

For candidate/recruiter testing, use **Register** and create separate accounts.

### Important security note

The Next.js demo intentionally uses browser `localStorage` so it can be demonstrated without configuring a database. It is **not production authentication**: passwords are stored locally in the browser and authorization is client-side. A production deployment should use server-side authentication, password hashing, HTTP-only secure cookies, a persistent database, and server/API authorization (for example Auth.js/NextAuth plus PostgreSQL).

### Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Deploy to Vercel

Import the GitHub repository into Vercel. Use **Next.js** as the framework preset and the repository root as the project root. No environment variables are required for the demo.

## Original WordPress implementation

The WordPress implementation remains under `wp-content/` and demonstrates:

- Custom WordPress theme
- Custom HireHub Core plugin
- Job custom post type
- Candidate and Recruiter roles
- Applications database table
- AJAX job search
- REST API endpoint
- Nonces, sanitization, escaping and capability checks
- Resume upload workflow

## Portfolio talking points

HireHub demonstrates a full recruitment workflow and gives interview talking points around WordPress/PHP, custom plugins, custom post types, roles/capabilities, REST APIs, AJAX, responsive frontend development, authentication UX, authorization concepts, data modeling and application-state management.
