"""Task update/move/delete and validation-first tests."""


def test_get_update_status_and_delete_task(client):
    created = client.post("/api/tasks", json={"title": "Move me"}).json()

    fetched = client.get(f"/api/tasks/{created['id']}")
    assert fetched.status_code == 200
    assert fetched.json()["title"] == "Move me"

    updated = client.put(
        f"/api/tasks/{created['id']}",
        json={"title": "Moved task", "priority": "high", "label": "flow"},
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["title"] == "Moved task"
    assert updated.json()["priority"] == "high"

    moved = client.patch(f"/api/tasks/{created['id']}/status", json={"status": "in_progress"})
    assert moved.status_code == 200
    assert moved.json()["status"] == "in_progress"

    deleted = client.delete(f"/api/tasks/{created['id']}")
    assert deleted.status_code == 204
    assert client.get(f"/api/tasks/{created['id']}").status_code == 404


def test_task_validation_errors_include_field_details(client):
    blank = client.post("/api/tasks", json={"title": "   "})
    assert blank.status_code == 422
    assert blank.json()["details"]["title"]

    bad_payload = client.post(
        "/api/tasks",
        json={"title": "Bad", "status": "archived", "priority": "urgent"},
    )
    assert bad_payload.status_code == 422
    details = bad_payload.json()["details"]
    assert details["status"]
    assert details["priority"]

    unknown_assignee = client.post("/api/tasks", json={"title": "Bad", "assignee_id": 999})
    assert unknown_assignee.status_code == 422
    assert unknown_assignee.json()["details"]["assignee_id"]

    created = client.post("/api/tasks", json={"title": "Valid"}).json()
    bad_move = client.patch(f"/api/tasks/{created['id']}/status", json={"status": "nope"})
    assert bad_move.status_code == 422
    assert client.get("/api/tasks/999999").status_code == 404
