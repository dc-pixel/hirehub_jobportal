# HireHub Job Portal

A portfolio-ready WordPress job portal built with a custom theme and a custom plugin.

## Features

- Job custom post type with salary, location, job type, experience, skills and company metadata
- Candidate registration and application workflow
- Resume upload with WordPress media handling
- Recruiter-facing job posting via shortcode
- Candidate application dashboard
- Job search and filtering
- AJAX job search
- Custom Candidate and Recruiter roles
- WordPress REST API endpoint for jobs
- Nonce verification, sanitization, escaping and capability checks
- Responsive frontend

## Project structure

- `wp-content/plugins/hirehub-core/` — application logic, CPTs, roles, applications, AJAX and REST API
- `wp-content/themes/hirehub/` — custom frontend theme and templates

## Installation

1. Install WordPress locally using LocalWP, XAMPP, Docker, or a WordPress host.
2. Copy the `wp-content/plugins/hirehub-core` folder into `wp-content/plugins/`.
3. Copy the `wp-content/themes/hirehub` folder into `wp-content/themes/`.
4. Activate **HireHub Core** from Plugins.
5. Activate **HireHub** from Appearance → Themes.
6. Create pages using the shortcodes documented below.
7. Visit Settings → Permalinks and click Save Changes once to refresh rewrite rules.

## Shortcodes

- `[hirehub_jobs]` — searchable job listing
- `[hirehub_apply]` — application form for the current job; place it on a page and pass `?job_id=123`, or use `[hirehub_apply job_id="123"]`
- `[hirehub_dashboard]` — candidate application dashboard
- `[hirehub_post_job]` — recruiter job posting form

## REST API

`GET /wp-json/hirehub/v1/jobs`

Optional query parameters: `search`, `location`, `job_type`, `paged`, `per_page`.

## Development notes

The business logic is kept in the plugin so the data model and workflows remain available if the presentation theme is changed. The theme is intentionally lightweight and uses standard WordPress APIs.

## Portfolio talking points

- Custom WordPress theme rather than a page-builder-only implementation
- Custom plugin architecture
- Custom post type and taxonomy
- Custom user roles/capabilities
- Secure form handling with nonces and sanitization
- AJAX and REST API integration
- Custom application table with indexed job/candidate columns
