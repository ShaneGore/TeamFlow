"""Team-member creation/deletion and task/member relationship tests."""


def test_member_crud_and_case_insensitive_uniqueness(client):
    created = client.post("/api/team-members", json={"name": "Alice"})
    assert created.status_code == 201, created.text
    member = created.json()
    assert member["name"] == "Alice"

    duplicate = client.post("/api/team-members", json={"name": "  alice  "})
    assert duplicate.status_code == 409
    assert "already exists" in duplicate.json()["message"]

    blank = client.post("/api/team-members", json={"name": "   "})
    assert blank.status_code == 422

    listed = client.get("/api/team-members")
    assert listed.status_code == 200
    assert any(item["name"] == "Alice" for item in listed.json())

    deleted = client.delete(f"/api/team-members/{member['id']}")
    assert deleted.status_code == 204
    assert client.delete(f"/api/team-members/{member['id']}").status_code == 404


def test_assigned_member_cannot_be_deleted_until_unassigned(client):
    member = client.post("/api/team-members", json={"name": "Bob"}).json()
    task = client.post("/api/tasks", json={"title": "Assigned work", "assignee_id": member["id"]}).json()
    assert task["assignee_id"] == member["id"]
    assert task["assignee_name"] == "Bob"

    blocked = client.delete(f"/api/team-members/{member['id']}")
    assert blocked.status_code == 409
    assert "assigned" in blocked.json()["message"]

    unassigned = client.put(f"/api/tasks/{task['id']}", json={"assignee_id": None})
    assert unassigned.status_code == 200
    assert unassigned.json()["assignee_id"] is None

    assert client.delete(f"/api/team-members/{member['id']}").status_code == 204


def test_task_assignee_filters_and_unknown_assignee_rejected(client):
    carol = client.post("/api/team-members", json={"name": "Carol"}).json()
    assigned = client.post("/api/tasks", json={"title": "Carol task", "assignee_id": carol["id"]}).json()
    unassigned = client.post("/api/tasks", json={"title": "Open task"}).json()

    filtered = client.get("/api/tasks", params={"assignee_id": carol["id"]})
    assert filtered.status_code == 200
    ids = [task["id"] for task in filtered.json()]
    assert assigned["id"] in ids
    assert unassigned["id"] not in ids

    bad = client.post("/api/tasks", json={"title": "Ghost", "assignee_id": 424242})
    assert bad.status_code == 422
