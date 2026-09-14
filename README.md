# TeamFlow

TeamFlow is a shared Kanban board for small teams. It provides one board with fixed `To Do`, `In Progress`, and `Done` columns, task assignment, priorities, due dates, labels, and persistent storage.

## Project Scope

The MVP is a full-stack application with:

- A React and Vite frontend.
- A FastAPI backend managed with `uv`.
- SQLAlchemy persistence with SQLite as the default local database.
- JSON HTTP endpoints under `/api`.
- No authentication or multiple-board support in the first version.

The complete product specification is in [_docs/specs.md](_docs/specs.md).

## Planned Development

The implementation follows the staged plan in the specification: establish the project structure, add the database and API, build the board UI, then add task management, drag-and-drop, team-member controls, testing, and documentation.

## Local Development

Once the frontend and backend are implemented, run them from their respective project directories using the commands documented by those projects. The backend should read its database URL from `DATABASE_URL` and allow the frontend development origin through CORS.
