#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -n "${MEDIA_ROOT:-}" ]]; then
  MEDIA_DIR="$MEDIA_ROOT"
elif [[ -d /var/data ]]; then
  MEDIA_DIR=/var/data/media
  export MEDIA_ROOT="$MEDIA_DIR"
else
  MEDIA_DIR=media
fi

mkdir -p "$MEDIA_DIR"
echo "Media directory: $MEDIA_DIR"

echo "Running database migrations..."
python manage.py migrate --noinput
echo "Migrations complete."

exec gunicorn config.wsgi:application --bind "0.0.0.0:${PORT:-8000}"
