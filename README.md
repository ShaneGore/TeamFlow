# TeamFlow

TeamFlow is a full-stack Kanban board for small teams. It provides one shared
board with fixed `To Do`, `In Progress`, and `Done` columns, persistent task
storage, and team-member assignment.

## MVP Features

- Create, edit, and delete tasks with server-side and client-side validation.
- Set task priorities, labels, due dates, and assignees.
- Move tasks between columns with drag-and-drop or a status selector.
- Create and delete team members, with protection against deleting members
	assigned to tasks.
- Persist data in a local SQLite database by default.
- Show loading, empty-board, and API error states in the UI.
- Expose JSON HTTP endpoints under `/api`, including an API health check.

The product specification is available in [_docs/specs.md](_docs/specs.md).

## Stack

- Frontend: React and Vite.
- Backend: FastAPI, Pydantic, SQLAlchemy 2.x, and Uvicorn.
- Tooling: `npm` for the frontend and `uv` for Python dependencies.
- Storage: SQLite by default, configurable through `DATABASE_URL`.

## Local Development

Prerequisites: Node.js/npm and [`uv`](https://docs.astral.sh/uv/).

Install dependencies in separate terminals:

```bash
cd backend
uv sync --group dev
```

```bash
cd frontend
npm install
```

Start the backend:

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

Start the frontend in the other terminal:

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. The frontend
talks to the backend at `http://localhost:8000` through the `/api` prefix. Vite
also proxies same-origin `/api` requests during development.

## Configuration

Copy `backend/.env.example` to `backend/.env` to configure the local database
and allowed frontend origins:

```dotenv
DATABASE_URL=sqlite:///./teamflow.db
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

The frontend API origin can be overridden with `frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

## Tests and Build

Run the backend test suite:

```bash
cd backend
uv run pytest -q
```

Build the frontend for production:

```bash
cd frontend
npm run build
```

The backend's interactive API documentation is available at
`http://localhost:8000/docs` while the server is running. The checked-in API
contract is in [backend/openapi.yaml](backend/openapi.yaml).

## MVP Boundaries

The first release intentionally supports one shared board and does not include
authentication, user accounts, multiple boards, notifications, or real-time
collaboration.
