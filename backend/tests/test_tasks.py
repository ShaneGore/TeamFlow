"""Endpoint-first tests: health, tasks, members, validation, relationships."""


def test_health_ok(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_and_list_tasks_roundtrip(client):
    created = client.post(
        "/api/tasks",
        json={
            "title": "Build API",
            "description": "Implement task endpoints.",
            "status": "todo",
            "priority": "medium",
            "due_date": "2026-10-05",
            "label": "backend",
            "assignee_id": None,
        },
    )
    assert created.status_code == 201, created.text
    body = created.json()
    assert body["id"] >= 1
    assert body["title"] == "Build API"
    assert body["status"] == "todo"
    assert body["priority"] == "medium"
    assert body["due_date"] == "2026-10-05"
    assert body["label"] == "backend"
    assert body["assignee_id"] is None
    assert body["assignee_name"] is None
    assert body["created_at"]
    assert body["updated_at"]

    listed = client.get("/api/tasks")
    assert listed.status_code == 200
    assert any(task["id"] == body["id"] for task in listed.json())


def test_task_defaults_and_filters(client):
    first = client.post("/api/tasks", json={"title": "First"}).json()
    second = client.post("/api/tasks", json={"title": "Second", "status": "done"}).json()
    assert first["status"] == "todo"
    assert first["priority"] is None
    assert first["due_date"] is None
    assert first["label"] == ""
    assert first["description"] == ""

    by_status = client.get("/api/tasks", params={"status": "done"})
    assert by_status.status_code == 200
    ids = [task["id"] for task in by_status.json()]
    assert second["id"] in ids
    assert first["id"] not in ids

    bad_status = client.get("/api/tasks", params={"status": "archived"})
    assert bad_status.status_code == 422
