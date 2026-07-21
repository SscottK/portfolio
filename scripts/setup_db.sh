#!/usr/bin/env bash
set -euo pipefail

DB_NAME="${1:-portfolio_dev}"

echo "Current postgres user:"
psql -d postgres -t -A -c "SELECT current_user;"

echo "Existing databases:"
psql -d postgres -t -A -c "SELECT datname FROM pg_database ORDER BY datname;"

if psql -d postgres -t -A -c "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}';" | grep -q 1; then
  echo "Database '${DB_NAME}' already exists."
else
  echo "Creating database '${DB_NAME}'..."
  createdb "${DB_NAME}"
  echo "Created '${DB_NAME}'."
fi

echo "Testing connection:"
psql -d "${DB_NAME}" -c "SELECT current_user, current_database();"
