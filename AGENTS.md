# TeamFlow Agent Guidance

## Project Direction

Build the MVP described in `_docs/specs.md`. Keep the first release focused on one shared Kanban board, three fixed statuses, task CRUD, drag-and-drop status changes, and team-member assignment.

## Architecture

- Keep the frontend and backend as separate applications.
- Use React with Vite for the frontend.
- Use FastAPI, Pydantic, SQLAlchemy 2.x, and Uvicorn for the backend.
- Use `uv` for Python dependency and environment management.
- Keep persistence behind SQLAlchemy and make `DATABASE_URL` configurable.
- Communicate between frontend and backend through JSON HTTP APIs under `/api`.

## Quality Requirements

- Validate input in both the frontend and backend.
- Preserve server-confirmed state after create, edit, delete, and status operations.
- Return clear HTTP errors without exposing database implementation details.
- Add focused tests for API validation, task/member relationships, and the main UI workflows.
- Keep the fixed column model simple; do not add authentication, multiple boards, or out-of-scope features without an explicit requirement.
