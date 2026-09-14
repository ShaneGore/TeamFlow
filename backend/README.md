# TeamFlow Backend

FastAPI + SQLAlchemy backend implementing `backend/openapi.yaml`.

Recommended local database: **SQLite file** auto-created on startup. It needs
no server, no migrations for the MVP, and can be replaced with PostgreSQL later
through `DATABASE_URL`.

## Setup (uv)

```bash
cd backend
uv sync --group dev
```

## Run

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

Health check: `GET http://localhost:8000/api/health`

## Database

Layers:

- `app/config.py` — reads `DATABASE_URL` and driver-specific engine options.
- `app/database.py` — SQLAlchemy engine/session factory and `init_db()`.
- `app/models/` — `Task` and `TeamMember` ORM models.
- `app/repositories/` — all database queries; routers never use SQL directly.
- `app/routers/` — HTTP routes, validation, status codes, and business errors.
- `app/services.py` — shared task/member rules and response shaping.

Configure with:

```bash
DATABASE_URL=sqlite:///./teamflow.db
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Notes:

- Tables are created automatically at startup with `init_db()`.
- SQLite is the beginner-friendly default.
- To switch databases later, install the matching driver and change only
  `DATABASE_URL` (for example `postgresql+psycopg://...`).
- No SQLite-specific queries are used; Alembic can be added later if schema
  migrations become necessary.

## Tests

```bash
cd backend
uv run pytest -q
```

Covers API validation, task/member relationships, repository behavior, and
file-backed SQLite persistence/reload behavior.
