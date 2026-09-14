# TeamFlow — Mini Kanban Board Product Specification

## 1. Application Name

### Recommended name: **TeamFlow**

TeamFlow is a small shared Kanban board for teams to organize tasks, track progress, and assign work to named team members.

Other creative name options:

- **Tasklane** — emphasizes moving work through a workflow.
- **FlowBoard** — simple and immediately communicates the Kanban concept.
- **SprintNest** — friendly and project-oriented.
- **KanbanKit** — practical and suitable for a homework/demo application.
- **TaskFlow** — clear and easy to remember.

**Selected name: TeamFlow** because it communicates the small-team purpose while remaining broad enough for future enhancements.

---

## 2. Purpose and Target Users

### Purpose

TeamFlow is a web-based, full-stack application that gives a small team one shared Kanban board for managing work.

The application demonstrates an end-to-end architecture:

- A browser-based frontend built with Node.js-based tooling.
- A Python backend built with FastAPI and managed with `uv`.
- A database accessed through SQLAlchemy.
- HTTP/JSON communication between frontend and backend.

The MVP intentionally uses **one shared board** and does not require user accounts or authentication.

### Target users

The target users are small teams such as:

- Students working on a group assignment.
- A small software/project team.
- A club or volunteer group.
- A small team managing a simple project.

Users are represented by named team members. A task can optionally be assigned to one team member.

---

## 3. Core Features

The MVP includes:

1. A single shared Kanban board.
2. Three fixed columns:
   - To Do
   - In Progress
   - Done
3. Create tasks.
4. View tasks.
5. Edit tasks.
6. Delete tasks.
7. Move tasks between columns.
8. Drag and drop tasks between columns.
9. A status control as a non-drag fallback.
10. Task title and description.
11. Optional priority:
    - None
    - Low
    - Medium
    - High
12. Optional due date.
13. Optional text label.
14. Optional assignment to a named team member.
15. Create team members.
16. Delete team members when they are not assigned to tasks.
17. Persistent storage through a relational database.
18. REST-style HTTP API returning JSON.
19. Basic validation and user-friendly error handling.

---

## 4. User Stories

### Team members

- As a team member, I want to see all work on one shared board so that I know what the team is working on.
- As a team member, I want to add a task so that new work can be recorded.
- As a team member, I want to edit a task so that its details remain accurate.
- As a team member, I want to delete a task when it is no longer needed.
- As a team member, I want to move a task between columns so that its progress is visible.
- As a team member, I want to drag a task to another column so that updating its status is quick.
- As a team member, I want to assign a task to a named teammate so that responsibility is clear.
- As a team member, I want to give a task a priority so that important work stands out.
- As a team member, I want to set an optional due date so that deadlines are visible.
- As a team member, I want to add an optional label so that related work can be identified.
- As a team member, I want the board to retain my changes so that work is not lost when the page is refreshed.
- As a team member, I want clear error messages when an action fails so that I know what to do next.

### Team administration

- As a team member, I want to add a teammate's name so that they can be assigned to tasks.
- As a team member, I want to remove a team member who is no longer part of the project, provided they have no assigned tasks.

---

## 5. Functional Requirements

### Task management

FR-01. The system shall allow creation of a task.

FR-02. A task shall require a non-empty title.

FR-03. A task shall support an optional description.

FR-04. A task shall have exactly one status from:
- `todo`
- `in_progress`
- `done`

FR-05. A newly created task shall default to `todo`.

FR-06. A task may have an optional priority of:
- `low`
- `medium`
- `high`

A missing priority represents no priority.

FR-07. A task may have an optional due date.

FR-08. A task may have an optional text label.

FR-09. A task may have an optional assignee referencing a team member.

FR-10. The system shall allow a task to be edited.

FR-11. The system shall allow a task to be deleted after user confirmation.

FR-12. The system shall allow a task's status to be changed directly.

FR-13. The system shall allow a task to be moved between columns using drag and drop.

FR-14. The drag-and-drop action shall persist the new status through the backend API.

FR-15. The system shall allow tasks to be viewed on the board.

### Team member management

FR-16. The system shall allow creation of a team member with a required name.

FR-17. Team member names shall be unique after normalization of leading/trailing whitespace and case for comparison.

FR-18. The system shall allow deletion of a team member only when the member is not assigned to any task.

FR-19. The system shall return a clear error when deletion is blocked because tasks still reference the member.

### Board behavior

FR-20. The board shall always contain the three fixed columns:
- To Do
- In Progress
- Done

FR-21. Columns shall not be created, renamed, reordered, or deleted in the MVP.

FR-22. Tasks shall be displayed in their current status column.

FR-23. The board shall load persisted tasks from the backend when opened or refreshed.

FR-24. After a successful create, edit, delete, or move operation, the UI shall reflect the persisted server state.

---

## 6. Frontend Requirements

### Technology

Recommended frontend stack:

- Node.js 20+ for project tooling/runtime support.
- React for the browser UI.
- Vite for development and production build tooling.
- Standard HTML/CSS or a small CSS framework.
- A lightweight drag-and-drop implementation.

Node.js is the required frontend environment; React + Vite is recommended because it keeps the UI component-based and straightforward for a homework project.

The frontend shall communicate with the backend only through HTTP API requests.

### Screens

The MVP intentionally uses one primary screen.

#### Main Board Screen

The main screen shall contain:

- Application header with the TeamFlow name.
- Team member control.
- Add Task button.
- Three Kanban columns.
- Task cards within each column.
- Loading state.
- Empty-state messaging where appropriate.
- Error messaging when API operations fail.

#### Task Modal

The modal is reused for both creating and editing tasks.

Fields:

- Title — required.
- Description — optional multiline text.
- Status — required, defaulting to the current status for edits.
- Priority — optional.
- Due date — optional.
- Label — optional.
- Assignee — optional dropdown populated from team members.

Actions:

- Save/Create.
- Cancel.
- Delete when editing an existing task.

#### Team Member UI

A small section of the main screen shall allow:

- Viewing existing team members.
- Adding a team member.
- Deleting an eligible team member.

The UI should avoid introducing a separate dashboard or settings area.

### Components

Suggested component breakdown:

- `App`
- `Board`
- `KanbanColumn`
- `TaskCard`
- `TaskModal`
- `TaskForm`
- `TeamMemberPanel`
- `TeamMemberForm`
- `PriorityBadge`
- `TaskMeta`
- `LoadingState`
- `ErrorMessage`
- `ConfirmDialog`

### Task card behavior

Task cards shall remain compact.

The card shall prominently show:

- Task title.

The card may show compact metadata indicators:

- Priority.
- Due date.
- Label.
- Assignee.

The full description should not normally be shown on the board.

Task cards shall provide an obvious interaction for:

- Opening the edit modal.
- Changing status.

### User interactions

- Clicking **Add Task** opens an empty task modal.
- Clicking a task opens the edit modal.
- Clicking **Save** submits the appropriate API request.
- Clicking **Delete** requests confirmation before deletion.
- Dragging a task over another column provides visual feedback.
- Dropping a task changes its status and persists the change.
- The status control provides an alternative way to move a task.
- Adding a team member updates the assignee dropdown.
- Attempting to delete an assigned team member shows an explanatory error.

### Responsive behavior

The board should work on normal desktop and laptop screen sizes.

On narrower screens, columns may stack vertically or become horizontally scrollable.

The MVP does not require a specialized mobile application.

---

## 7. Backend Requirements

### Technology

- Python 3.12+ recommended.
- `uv` for Python project and dependency management.
- FastAPI for the HTTP API.
- SQLAlchemy 2.x for ORM/database access.
- Pydantic models for request/response validation.
- Uvicorn as the ASGI development server.

### Server responsibilities

The backend shall:

1. Expose HTTP endpoints for tasks and team members.
2. Validate incoming request data.
3. Apply business rules.
4. Read and write data through SQLAlchemy.
5. Persist task status changes.
6. Enforce task/team-member relationships.
7. Return JSON responses.
8. Return appropriate HTTP status codes.
9. Avoid exposing database implementation details to the frontend.
10. Enable CORS for the frontend's development origin.

### API endpoints

Base API path:

`/api`

#### Health

`GET /api/health`

Purpose:
- Confirm that the backend is running.

Response:

```json
{
  "status": "ok"
}
```

#### Tasks

`GET /api/tasks`

Returns all tasks.

Optional query parameters may include:
- `status`
- `assignee_id`

The MVP does not require advanced search/filtering, so these query parameters may be omitted initially.

`GET /api/tasks/{task_id}`

Returns one task.

`POST /api/tasks`

Creates a task.

Expected fields:

```json
{
  "title": "Build login screen",
  "description": "Create the first version of the login UI.",
  "status": "todo",
  "priority": "high",
  "due_date": "2026-10-01",
  "label": "frontend",
  "assignee_id": 2
}
```

`PUT /api/tasks/{task_id}`

Replaces/updates editable task fields.

`PATCH /api/tasks/{task_id}/status`

Updates only the task status.

Example request:

```json
{
  "status": "in_progress"
}
```

`DELETE /api/tasks/{task_id}`

Deletes a task.

#### Team members

`GET /api/team-members`

Returns all team members.

`POST /api/team-members`

Creates a team member.

Example:

```json
{
  "name": "Alice"
}
```

`DELETE /api/team-members/{member_id}`

Deletes a team member if the member has no assigned tasks.

### Recommended response shape

Task responses should include their core fields plus a useful assignee summary where appropriate.

Example:

```json
{
  "id": 12,
  "title": "Build API",
  "description": "Implement task endpoints.",
  "status": "in_progress",
  "priority": "medium",
  "due_date": "2026-10-05",
  "label": "backend",
  "assignee_id": 3,
  "assignee_name": "Bob",
  "created_at": "2026-09-14T20:15:00Z",
  "updated_at": "2026-09-14T20:30:00Z"
}
```

### Backend architecture

Recommended separation:

- API/router layer.
- Pydantic schemas.
- SQLAlchemy models.
- Database/session layer.
- Service/business-logic layer where useful.
- Application configuration.

For this homework, a very large enterprise-style architecture is unnecessary.

---

## 8. Database Requirements

### Database approach

The application shall be **database-agnostic at the application layer**.

SQLAlchemy shall be used for database access rather than writing application logic tied directly to one database engine.

### Default local database

Use **SQLite** as the default development database because it is easy to run locally and requires no separate database server.

The database URL should come from configuration, for example:

`DATABASE_URL`

This allows another relational database supported by SQLAlchemy to be substituted later.

### Entities

The MVP requires two database entities.

#### TeamMember

Fields:

| Field | Type | Required | Constraints |
|---|---|---:|---|
| `id` | Integer | Yes | Primary key |
| `name` | String | Yes | Unique logical name; non-empty |
| `created_at` | DateTime | Yes | Server-generated |

#### Task

Fields:

| Field | Type | Required | Constraints |
|---|---|---:|---|
| `id` | Integer | Yes | Primary key |
| `title` | String | Yes | Non-empty |
| `description` | Text/String | No | Nullable |
| `status` | String/Enum | Yes | `todo`, `in_progress`, `done` |
| `priority` | String/Enum | No | `low`, `medium`, `high` |
| `due_date` | Date | No | Nullable |
| `label` | String | No | Nullable |
| `assignee_id` | Integer | No | Foreign key to `team_member.id` |
| `created_at` | DateTime | Yes | Server-generated |
| `updated_at` | DateTime | Yes | Updated by server |

### Relationships

- One `TeamMember` can be assigned to many `Task` records.
- One `Task` can have zero or one assignee.
- A task's `assignee_id` may be null.

Relationship:

`TeamMember 1 ---- * Task`

### Constraints

- Task title must not be empty after trimming whitespace.
- Team member name must not be empty after trimming whitespace.
- Team member names must be unique for practical use.
- Task status must be one of the three allowed values.
- Task priority must be null or one of the three allowed values.
- `assignee_id` must reference an existing team member or be null.
- Dates must use a consistent API format.
- A team member cannot be deleted while referenced by a task.

### Database initialization

The backend should initialize/create required tables in a beginner-friendly manner.

A migration framework such as Alembic can be added later, but it is not required for the first homework milestone unless the course expects migration tooling.

---

## 9. Kanban Columns and Task Behavior

### Fixed columns

| Column | Status value | Meaning |
|---|---|---|
| To Do | `todo` | Work has not started |
| In Progress | `in_progress` | Work is actively being worked on |
| Done | `done` | Work is complete |

### Status transitions

Any task may move directly between any of the three columns.

Examples:

- To Do → In Progress
- To Do → Done
- In Progress → To Do
- In Progress → Done
- Done → In Progress

The MVP does not enforce workflow restrictions.

### Drag-and-drop

1. User starts dragging a task card.
2. Available columns show a visual drop state.
3. User drops the task into another column.
4. Frontend sends a status update to the backend.
5. Backend validates the status.
6. Database stores the new status.
7. Frontend updates the board using the confirmed server result.
8. On failure, the task should return to its previous known state and show an error.

### Status control

Every task shall also provide a simple status control so users can move tasks without drag-and-drop.

This is both an accessibility/usability feature and a fallback for browsers or devices where dragging is inconvenient.

---

## 10. Frontend-Backend Communication Flow

### Initial page load

1. Browser loads the frontend.
2. Frontend requests `GET /api/tasks`.
3. Frontend requests `GET /api/team-members`.
4. Backend validates and queries through SQLAlchemy.
5. Backend returns JSON.
6. Frontend renders the board and team-member controls.

### Creating a task

1. User opens **Add Task**.
2. User enters task information.
3. Frontend validates required fields.
4. Frontend sends `POST /api/tasks`.
5. FastAPI validates the request.
6. Backend creates the task through SQLAlchemy.
7. Backend returns the created task.
8. Frontend inserts/renders the returned task in the correct column.
9. Modal closes.

### Editing a task

1. User opens a task.
2. Frontend populates the modal with existing data.
3. User changes fields.
4. Frontend sends `PUT /api/tasks/{task_id}`.
5. Backend validates and persists changes.
6. Backend returns the updated task.
7. Frontend updates the card.

### Moving a task

1. User uses drag-and-drop or the status control.
2. Frontend determines the target status.
3. Frontend sends `PATCH /api/tasks/{task_id}/status`.
4. Backend validates the status.
5. SQLAlchemy updates the database.
6. Backend returns the updated task.
7. Frontend reflects the confirmed status.

### Deleting a task

1. User clicks delete.
2. Frontend displays a confirmation prompt.
3. Frontend sends `DELETE /api/tasks/{task_id}`.
4. Backend deletes the record.
5. Backend returns success.
6. Frontend removes the card.

### Team member creation

1. User enters a name.
2. Frontend validates the input.
3. Frontend sends `POST /api/team-members`.
4. Backend checks uniqueness.
5. Backend stores the member.
6. Frontend refreshes the team-member list and assignee dropdown.

---

## 11. Validation and Error-Handling Rules

### Frontend validation

The frontend should provide immediate feedback for obvious input errors.

Rules:

- Title is required.
- Title must contain non-whitespace characters.
- Team member name is required.
- Team member name must contain non-whitespace characters.
- Due date must be a valid date if supplied.
- Status must be one of the supported values.
- Priority must be empty or one of the supported values.

The frontend should not be the only validation layer.

### Backend validation

The backend shall repeat all important validation because API requests cannot be assumed to originate from the frontend.

### HTTP status expectations

Recommended responses:

- `200 OK` — successful read/update operation.
- `201 Created` — successful creation.
- `204 No Content` — successful deletion.
- `400 Bad Request` — malformed or invalid request.
- `404 Not Found` — requested task/team member does not exist.
- `409 Conflict` — uniqueness or relationship conflict, such as deleting an assigned member.
- `422 Unprocessable Entity` — FastAPI/Pydantic validation failure where appropriate.
- `500 Internal Server Error` — unexpected server failure.

### User-facing errors

Errors shown in the frontend should be understandable.

Examples:

- `Task title is required.`
- `Team member name is required.`
- `That team member already exists.`
- `This team member cannot be deleted because they are assigned to one or more tasks.`
- `The task could not be saved. Please try again.`
- `The server is unavailable. Please check that the backend is running.`

The frontend should not expose raw stack traces or database error messages.

### Loading behavior

The UI should visibly indicate when:

- The initial board is loading.
- A task is being saved.
- A delete action is in progress.
- A status update is in progress.

Buttons should avoid accidentally submitting the same request multiple times.

---

## 12. Out-of-Scope Features

The following are intentionally excluded from the MVP:

- User authentication/login.
- Passwords and account management.
- Role-based access control.
- Multiple boards.
- Board creation/deletion.
- Custom Kanban columns.
- Column reordering.
- Task comments.
- File attachments.
- Task activity/history feed.
- Email notifications.
- Push notifications.
- Real-time multi-user synchronization using WebSockets.
- Advanced search.
- Complex filtering/sorting.
- Recurring tasks.
- Subtasks.
- Time tracking.
- Calendar views.
- Reporting/analytics dashboards.
- Integrations with GitHub, Slack, Microsoft Teams, etc.
- Mobile-native applications.
- Offline-first support.
- Complex database migrations as a mandatory requirement.

These can be mentioned as future enhancements rather than implemented in version 1.

---

## 13. Acceptance Criteria

The MVP is considered complete when all of the following are true.

### Board

- [ ] Opening the application displays one shared board.
- [ ] The board contains To Do, In Progress, and Done columns.
- [ ] Tasks appear in the correct column based on their stored status.
- [ ] The board can be refreshed without losing persisted data.

### Tasks

- [ ] A user can create a task with a title.
- [ ] A task can contain a description.
- [ ] A task can optionally have priority, due date, label, and assignee.
- [ ] A user can view task details by opening the task.
- [ ] A user can edit an existing task.
- [ ] A user can delete a task after confirmation.
- [ ] Task title and other required values are validated.
- [ ] Invalid tasks are rejected by the backend.

### Kanban behavior

- [ ] A task can be moved with drag and drop.
- [ ] A task can also be moved using a status control.
- [ ] Moving a task persists its status in the database.
- [ ] Refreshing the page shows the persisted status.

### Team members

- [ ] A user can create a team member.
- [ ] A new team member appears in the assignee selector.
- [ ] A user can assign a task to a team member.
- [ ] An unassigned team member can be deleted.
- [ ] An assigned team member cannot be deleted without first resolving their task assignments.

### Backend/API

- [ ] The FastAPI server starts successfully.
- [ ] `GET /api/health` returns a healthy response.
- [ ] Task CRUD endpoints work.
- [ ] Team-member endpoints work.
- [ ] Invalid API input returns an appropriate error.
- [ ] Missing resources return `404`.
- [ ] Relationship conflicts return an appropriate error such as `409`.

### Database

- [ ] Application data is persisted in a relational database.
- [ ] SQLAlchemy is used for database access.
- [ ] The database URL is configurable.
- [ ] The application is not dependent on SQLite-specific SQL behavior.

### End-to-end workflow

- [ ] Frontend can communicate with the FastAPI backend over HTTP.
- [ ] Data entered in the frontend is persisted in the database.
- [ ] Data stored in the database is returned through the API and rendered in the frontend.
- [ ] A complete create → store → retrieve → update → delete workflow can be demonstrated.

---

## 14. Suggested Project Folder Structure

A simple repository layout is recommended:

```text
teamflow/
├── SPEC.md
├── README.md
├── frontend/
│   ├── package.json
│   ├── vite.config.*
│   ├── index.html
│   └── src/
│       ├── main.*
│       ├── App.*
│       ├── components/
│       │   ├── Board.*
│       │   ├── KanbanColumn.*
│       │   ├── TaskCard.*
│       │   ├── TaskModal.*
│       │   ├── TaskForm.*
│       │   ├── TeamMemberPanel.*
│       │   └── ConfirmDialog.*
│       ├── services/
│       │   └── api.*
│       ├── types/
│       │   └── index.*
│       └── styles/
│           └── app.*
│
└── backend/
    ├── pyproject.toml
    ├── uv.lock
    ├── app/
    │   ├── __init__.py
    │   ├── main.py
    │   ├── config.py
    │   ├── database.py
    │   ├── models/
    │   │   ├── __init__.py
    │   │   ├── task.py
    │   │   └── team_member.py
    │   ├── schemas/
    │   │   ├── __init__.py
    │   │   ├── task.py
    │   │   └── team_member.py
    │   ├── routers/
    │   │   ├── __init__.py
    │   │   ├── tasks.py
    │   │   ├── team_members.py
    │   │   └── health.py
    │   └── services/
    │       ├── __init__.py
    │       ├── task_service.py
    │       └── team_member_service.py
    └── tests/
        ├── test_tasks.py
        ├── test_team_members.py
        └── test_health.py
```

The exact frontend file extensions and organization may vary depending on whether JavaScript or TypeScript is selected. TypeScript is recommended but not required unless the course specifies it.

---

## 15. Suggested Implementation Plan

### Phase 1 — Project setup

#### Frontend

1. Create a Node.js frontend project.
2. Set up React + Vite.
3. Create the basic `App` component.
4. Add initial styling and the three board columns.
5. Confirm the frontend runs locally.

#### Backend

1. Initialize the Python backend with `uv`.
2. Add FastAPI, Uvicorn, SQLAlchemy, and validation dependencies.
3. Create the FastAPI application.
4. Add `/api/health`.
5. Configure CORS for local frontend development.
6. Confirm the backend runs locally.

### Phase 2 — Database and models

1. Configure `DATABASE_URL`.
2. Create SQLAlchemy engine/session handling.
3. Create `TeamMember` model.
4. Create `Task` model.
5. Define the team-member/task relationship.
6. Create the database tables.
7. Add basic backend validation schemas.

### Phase 3 — Team-member API

1. Implement `GET /api/team-members`.
2. Implement `POST /api/team-members`.
3. Implement `DELETE /api/team-members/{member_id}`.
4. Add uniqueness validation.
5. Add protection against deleting assigned members.
6. Test the endpoints.

### Phase 4 — Task API

1. Implement `GET /api/tasks`.
2. Implement `GET /api/tasks/{task_id}`.
3. Implement `POST /api/tasks`.
4. Implement `PUT /api/tasks/{task_id}`.
5. Implement `PATCH /api/tasks/{task_id}/status`.
6. Implement `DELETE /api/tasks/{task_id}`.
7. Add validation for title, status, priority, dates, and assignee.
8. Test the endpoints.

### Phase 5 — Frontend board

1. Build the `Board` component.
2. Build three `KanbanColumn` components.
3. Build compact `TaskCard` components.
4. Create the API client/service layer.
5. Load tasks and team members from the backend.
6. Render tasks into their appropriate columns.

### Phase 6 — Task CRUD UI

1. Build the task modal/form.
2. Implement task creation.
3. Implement task editing.
4. Implement task deletion with confirmation.
5. Display validation and API errors.
6. Add loading states.

### Phase 7 — Kanban interactions

1. Add the status control.
2. Add drag-and-drop.
3. Send status changes to the backend.
4. Confirm the server response before finalizing UI state.
5. Handle failed status updates gracefully.

### Phase 8 — Team-member UI

1. Add the team-member panel/form.
2. Connect create/delete actions to the API.
3. Populate the task assignee dropdown.
4. Show useful relationship errors.

### Phase 9 — Testing and polish

Test the complete workflow:

`Create member → Create task → Assign task → Move task → Edit task → Refresh → Delete task`

Also test:

- Invalid task title.
- Duplicate team member.
- Missing team member.
- Invalid status.
- Invalid priority.
- Deleting an assigned team member.
- Backend unavailable.
- Failed API request.
- Empty board state.

### Phase 10 — Documentation and demonstration

The final homework submission should include:

- `SPEC.md`
- `README.md`
- Frontend project.
- Backend project.
- Database configuration instructions.
- Instructions for starting frontend and backend.
- A short demonstration of the end-to-end workflow.

---

## Recommended MVP Decisions Summary

| Decision | MVP Choice |
|---|---|
| Application type | Shared team Kanban board |
| Boards | One shared board |
| Users | Named team members, no login |
| Columns | To Do, In Progress, Done |
| Task CRUD | Yes |
| Drag and drop | Yes |
| Status control | Yes |
| Description | Yes |
| Priority | Optional: None/Low/Medium/High |
| Due date | Optional |
| Label | Optional text |
| Assignee | Optional team member |
| Team-member CRUD | Simple create/delete |
| Frontend | React + Vite using Node.js |
| Backend | FastAPI |
| Python management | `uv` |
| ORM | SQLAlchemy |
| Default database | SQLite |
| Database architecture | Database-agnostic via SQLAlchemy |
| Communication | HTTP/JSON REST-style API |
| Authentication | Out of scope |
| Real-time collaboration | Out of scope |
| Multiple boards | Out of scope |

---

## MVP Definition of Done

TeamFlow is ready for submission when a student can start the frontend and backend locally, open the board in a browser, create team members and tasks, assign and edit tasks, move tasks using both drag-and-drop and a status control, delete tasks, refresh the browser without losing data, and demonstrate that the data travels through the HTTP API into persistent database storage and back to the UI.
