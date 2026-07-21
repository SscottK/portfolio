# Portfolio

Personal portfolio site with a **Django REST Framework** backend and **Vite + React** frontend. Manage projects and profile content in Django Admin; the React app reads from the API.

## Stack

- Backend: Django 6, DRF, PostgreSQL
- Frontend: Vite, React, React Router
- Deploy targets: Render (API) + Vercel (frontend)

## Project layout

```text
portfolio/
├── backend/          # Django + DRF API
├── frontend/         # Vite React SPA
├── .env.example      # Copy to .env for local dev
└── README.md
```

## 1. Create the PostgreSQL database

On WSL, create a database and ensure your user can connect:

```sql
CREATE DATABASE portfolio_dev;
```

If you use a different database name or user, update `.env` accordingly.

## 2. Backend setup

```bash
cd ~/portfolio
cp .env.example .env
# Edit .env with your DB_USER / DB_PASSWORD if needed

source .venv/bin/activate
cd backend
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_data
python manage.py runserver
```

API runs at `http://127.0.0.1:8000/`

Useful endpoints:

- `GET /api/projects/`
- `GET /api/projects/<slug>/`
- `GET /api/profile/`
- Django Admin: `http://127.0.0.1:8000/admin/`

Query filters for projects:

- `?featured=true`
- `?built_with_cursor=true`
- `?hand_coded=true`

## 3. Frontend setup

In a second terminal:

```bash
cd ~/portfolio/frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173/` and proxies `/api` to Django during development.

## Managing content

Use Django Admin to edit:

- **Profile** — name, headline, bio, Cursor story, links
- **Projects** — descriptions, tech stack, GitHub/demo links, Cursor vs hand-coded flags, featured toggle

The `seed_data` command loads sample content you can replace.

## Deployment notes

### Render (backend)

- Create a Web Service pointing at `backend/`
- Build: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
- Start: `gunicorn config.wsgi:application`
- Add env vars from `.env.example` plus production `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, and Render Postgres credentials
- Set `CORS_ALLOWED_ORIGINS` to your Vercel URL

### Vercel (frontend)

- Root directory: `frontend`
- Build: `npm run build`
- Output: `dist`
- Set `VITE_API_BASE_URL` to your Render API origin (e.g. `https://your-api.onrender.com`)

## Local env reference

See `.env.example` for all backend variables. Frontend uses `VITE_API_BASE_URL` only in production; local dev uses the Vite proxy.
