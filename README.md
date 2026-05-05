# Personal Portfolio Website

This monorepo contains a full-stack personal portfolio application with a public one-page portfolio, a protected admin panel, Supabase-backed content management, resume hosting, and contact message handling.

## Project overview

The frontend lives in `client/` and is built with React, Vite, Tailwind CSS v3, React Router, Axios, and Supabase Auth. The backend lives in `server/` and is built with Express, Supabase service-role access, Nodemailer, and supporting middleware for validation, security headers, and logging.

```text
portfolio/
├── client/   # Vite + React frontend
├── server/   # Express API, Supabase integration, email handling
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- A Supabase project
- SMTP credentials for contact form notifications

## Setup

1. Clone the repository.

```bash
git clone <your-repository-url>
cd Personal-Portfolio-Website/portfolio
```

2. Set up a Supabase project and run the schema in [server/src/config/supabase_schema.sql](D:/CodeBase/Personal-Portfolio-Website/portfolio/server/src/config/supabase_schema.sql).

3. Create these public Supabase Storage buckets:
   - `resumes`
   - `profile-images`
   - `thumbnails`

4. Fill in `server/.env` from `server/.env.example`.

5. Fill in `client/.env` from `client/.env.example`.

6. Install dependencies in both apps.

```bash
cd server
npm install

cd ../client
npm install
```

7. Start both development servers.

```bash
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm run dev
```

The default development URLs are:

- Frontend – `http://localhost:5173`
- Backend – `http://localhost:5000`

## Environment variables

Server variables live in `server/.env`:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
DEVELOPER_EMAIL=
NODE_ENV=development
```

Client variables live in `client/.env`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=http://localhost:5000/api
```

## API routes

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Health check |
| `GET` | `/api/personal-info` | Public | Fetch the public profile row |
| `PUT` | `/api/personal-info` | Admin | Update the public profile row |
| `GET` | `/api/education` | Public | List education entries |
| `POST` | `/api/education` | Admin | Create an education entry |
| `PUT` | `/api/education/:id` | Admin | Update an education entry |
| `DELETE` | `/api/education/:id` | Admin | Delete an education entry |
| `GET` | `/api/experience` | Public | List experience entries |
| `POST` | `/api/experience` | Admin | Create an experience entry |
| `PUT` | `/api/experience/:id` | Admin | Update an experience entry |
| `DELETE` | `/api/experience/:id` | Admin | Delete an experience entry |
| `GET` | `/api/projects` | Public | List all projects |
| `GET` | `/api/projects/featured` | Public | List featured projects |
| `POST` | `/api/projects` | Admin | Create a project |
| `PUT` | `/api/projects/:id` | Admin | Update a project |
| `DELETE` | `/api/projects/:id` | Admin | Delete a project |
| `GET` | `/api/certificates` | Public | List certificates |
| `POST` | `/api/certificates` | Admin | Create a certificate |
| `PUT` | `/api/certificates/:id` | Admin | Update a certificate |
| `DELETE` | `/api/certificates/:id` | Admin | Delete a certificate |
| `GET` | `/api/skills` | Public | List skills grouped by category |
| `POST` | `/api/skills` | Admin | Create a skill |
| `PUT` | `/api/skills/:id` | Admin | Update a skill |
| `DELETE` | `/api/skills/:id` | Admin | Delete a skill |
| `GET` | `/api/hobbies` | Public | List hobbies |
| `POST` | `/api/hobbies` | Admin | Create a hobby |
| `PUT` | `/api/hobbies/:id` | Admin | Update a hobby |
| `DELETE` | `/api/hobbies/:id` | Admin | Delete a hobby |
| `POST` | `/api/contact` | Public | Save a contact message and send an email notification |
| `GET` | `/api/contact/messages` | Admin | List contact messages |
| `PUT` | `/api/contact/messages/:id/read` | Admin | Mark a message as read |
| `DELETE` | `/api/contact/messages/:id` | Admin | Delete a message |
| `GET` | `/api/resume` | Public | Fetch the latest public resume URL |
| `POST` | `/api/resume/upload` | Admin | Upload a new public resume PDF |

## Deployment notes

For the frontend, Vite builds to static assets cleanly, so Vercel or Netlify are the simplest targets. Set the frontend environment variables in the hosting dashboard and point `VITE_API_BASE_URL` at the deployed backend URL.

For the backend, Railway and Render both work well for a small Express API. Configure the server environment variables there, allow the deployed frontend origin in `CLIENT_ORIGIN`, and make sure the backend can reach Supabase and your SMTP provider.

## Notes

- The SQL schema file includes setup comments for storage buckets and row-level security.
- The backend uses the Supabase service role key. Keep `server/.env` private.
- Public resume downloads and image URLs depend on your Supabase Storage bucket permissions being configured correctly.
