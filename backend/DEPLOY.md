# Deploying the portfolio backend (Render)

Same model as **dnd-ai-app**: Render web service + Postgres + persistent disk at `/var/data`.

## 1. Create services from blueprint

1. Push this repo to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint** → connect the repo.
3. Render reads `render.yaml` and creates:
   - **portfolio-backend** (Python web service, starter plan, 1 GB disk at `/var/data`)
   - **portfolio-db** (Postgres)

After the first deploy, set **`CORS_ALLOWED_ORIGINS`** on the web service to your Vercel URL:

```text
https://your-portfolio.vercel.app,http://localhost:5173
```

Preview deploys on `https://*.vercel.app` are already allowed via regex.

## 2. What the disk is for

| Path | Purpose |
|------|---------|
| `/var/data/media` | Django uploads (project gallery images, certification badges) |

`MEDIA_ROOT` defaults to `/var/data/media` when the disk is mounted. Locally, files go to `backend/media/`.

The start script creates the media directory and runs migrations before gunicorn:

```bash
bash backend/scripts/start.sh
```

## 3. First-time production setup

After the backend is live:

```bash
# Render Shell (web service → Shell), from backend/
python manage.py createsuperuser
python manage.py seed_data      # optional sample projects
python manage.py seed_resume    # optional sample resume
python manage.py seed_certifications  # optional sample certs
```

Re-upload gallery images and certification badges in Django Admin if you need production-specific assets.

## 4. Vercel (frontend)

1. Import the repo in Vercel; set **Root Directory** to `frontend`.
2. Add environment variable:
   - `VITE_API_BASE_URL` = `https://portfolio-backend.onrender.com` (your Render URL)
3. Deploy. `frontend/vercel.json` handles SPA routing.

## 5. Local vs production

| Variable | Local | Render |
|----------|-------|--------|
| Database | `DB_*` in `.env` | `DATABASE_URL` (auto from Postgres) |
| Media | `backend/media/` | `/var/data/media` |
| API URL (frontend) | Vite proxy (empty `VITE_API_BASE_URL`) | `VITE_API_BASE_URL` on Vercel |
| Debug | `DJANGO_DEBUG=True` | `DJANGO_DEBUG=False` |

## 6. Notes

- **Starter plan** is required for persistent disks (same as dnd-ai-app).
- Disk storage is single-instance; do not scale the web service to multiple instances with a disk attached.
- Django Admin: `https://<your-render-host>/admin/` — `RENDER_EXTERNAL_URL` is added to CSRF trusted origins automatically.
