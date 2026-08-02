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
python manage.py seed_resume
python manage.py runserver
```

API runs at `http://127.0.0.1:8000/`

Useful endpoints:

- `GET /api/projects/`
- `GET /api/projects/<slug>/`
- `GET /api/profile/`
- `GET /api/resume/`
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
- **Resume** — contact info, summary, skills, education, resume projects, work experience
- **Projects** — descriptions, tech stack, GitHub/demo links, Cursor vs hand-coded flags, featured toggle, **gallery** (images + video demos on detail page)

The `seed_data` command loads sample content you can replace.

## Deployment notes

Deployment follows the same pattern as [dnd-ai-app](https://github.com/SscottK/dnd-ai-app): **Render** (API + Postgres + persistent disk) and **Vercel** (frontend).

See **`backend/DEPLOY.md`** for step-by-step production setup.

### Render (backend)

Use the included **`render.yaml`** blueprint, or configure manually:

- **Root directory:** `backend`
- **Build:** `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- **Start:** `bash scripts/start.sh` (runs migrations, then gunicorn)
- **Disk:** mount `/var/data` (1 GB) — uploads persist at `/var/data/media`
- **Env:** `DATABASE_URL` from Render Postgres, `MEDIA_ROOT=/var/data/media`, `DJANGO_DEBUG=False`, generated `DJANGO_SECRET_KEY`, and `CORS_ALLOWED_ORIGINS` with your Vercel URL

### Vercel (frontend)

- **Root directory:** `frontend`
- **Build:** `npm run build`
- **Output:** `dist`
- **`frontend/vercel.json`** rewrites all routes to `index.html` (React Router)
- Set **`VITE_API_BASE_URL`** to your Render API origin (e.g. `https://portfolio-backend.onrender.com`)

Preview deploys on `*.vercel.app` are allowed via CORS regex on the backend.

## Local env reference

See `.env.example` for all backend variables. Frontend uses `VITE_API_BASE_URL` only in production; local dev uses the Vite proxy.
