# Personal Portfolio Website

Monorepo for a professional portfolio site with a React frontend and an Express backend.

## Project Structure

```text
portfolio/
├── client/   # React frontend powered by Vite and TailwindCSS v3
├── server/   # Express backend for APIs, Supabase, and email handling
└── README.md
```

## Client

The frontend is located in `client/`.

```bash
cd client
npm install
npm run dev
```

## Server

The backend is located in `server/`.

```bash
cd server
npm install
npm run dev
```

## Environment Files

Create local environment files from the examples before running the app.

```text
client/.env
server/.env
```

The server example variables are documented in `server/.env.example`.
