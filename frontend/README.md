# TeamFlow Frontend

React + Vite Kanban UI for the TeamFlow MVP.

## Run

```bash
cd frontend
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

## Backend API wiring

All backend calls are centralized in one place:

- `src/api/client.js` — the only module UI code imports for data (`api.listTasks()`, etc.).
- `src/api/httpClient.js` — JSON `fetch()` wrapper for the FastAPI backend.
- `src/api/constants.js` — statuses, priorities, labels, and `ApiError`.

The UI always calls the backend over HTTP. There is no mock/data fallback in
the UI path.

Configure the backend origin with:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

Every request uses that origin plus the backend's `/api` prefix, for example
`http://localhost:8000/api/tasks` and `http://localhost:8000/api/team-members`.

Vite also proxies same-origin `/api` calls to the same backend during `npm run dev`.

## Features covered

- Shared board with fixed `To Do`, `In Progress`, and `Done` columns.
- Task create/edit/delete with validation and confirmation.
- Compact task cards with priority, label, due date, and assignee.
- Drag-and-drop status changes plus a per-card status dropdown fallback.
- Team-member create/delete, including the blocked-delete error for assigned members.
- Loading, empty-board, and API error states.
