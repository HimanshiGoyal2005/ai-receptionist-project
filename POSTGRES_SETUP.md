PostgreSQL Setup (local)

1. Install PostgreSQL (skip if already installed).

2. Create a database user and database (example):

```powershell
# Run in an elevated PowerShell or from psql shell
psql -U postgres -c "CREATE USER pg_user WITH PASSWORD 'pg_password';"
psql -U postgres -c "CREATE DATABASE receptionist_db OWNER pg_user;"
```

3. Update `app/.env` with your real credentials (the repo now has a placeholder):

```
DATABASE_URL=postgresql+psycopg2://pg_user:pg_password@localhost:5432/receptionist_db
```

4. Activate your virtualenv, install requirements and start the backend:

```powershell
cd app
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Notes:
- The app reads `DATABASE_URL` from `app/.env` (configured in `app/config.py`).
- `create_tables()` runs on startup and will create the necessary tables in PostgreSQL.