import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, apiMode } from '../api/client.js';
import { COLUMNS, toApiErrorMessage } from '../api/constants.js';
import { KanbanColumn } from './KanbanColumn.jsx';
import { TaskModal } from './TaskModal.jsx';
import { TeamMemberPanel } from './TeamMemberPanel.jsx';
import { ConfirmDialog, ErrorMessage, LoadingState } from './common.jsx';

export function Board() {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boardError, setBoardError] = useState('');
  const [memberError, setMemberError] = useState('');
  const [memberBusy, setMemberBusy] = useState(false);
  const [modal, setModal] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [movingId, setMovingId] = useState(null);
  const [confirmDeleteTask, setConfirmDeleteTask] = useState(null);
  const [confirmDeleteMember, setConfirmDeleteMember] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setBoardError('');
    try {
      const [taskList, memberList] = await Promise.all([api.listTasks(), api.listMembers()]);
      setTasks(taskList);
      setMembers(memberList);
    } catch (error) {
      setBoardError(toApiErrorMessage(error, 'Could not load the board.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    const map = { todo: [], in_progress: [], done: [] };
    for (const task of tasks) {
      if (map[task.status]) map[task.status].push(task);
    }
    return map;
  }, [tasks]);

  function openCreate(defaultStatus = 'todo') {
    setModalError(null);
    setModal({ mode: 'create', task: { status: defaultStatus } });
  }

  function openEdit(task) {
    setModalError(null);
    setModal({ mode: 'edit', task });
  }

  async function refreshFromServer(fallbackTasks) {
    try {
      const [taskList, memberList] = await Promise.all([api.listTasks(), api.listMembers()]);
      setTasks(taskList);
      setMembers(memberList);
    } catch {
      if (fallbackTasks) setTasks(fallbackTasks);
    }
  }

  async function saveModal(payload) {
    setModalSaving(true);
    setModalError(null);
    try {
      let saved;
      if (modal.mode === 'edit') saved = await api.updateTask(modal.task.id, payload);
      else saved = await api.createTask(payload);
      const next = modal.mode === 'edit'
        ? tasks.map((t) => (t.id === saved.id ? saved : t))
        : [...tasks, saved];
      await refreshFromServer(next);
      setModal(null);
    } catch (error) {
      setModalError({ message: toApiErrorMessage(error, 'Could not save.'), details: error.details });
    } finally {
      setModalSaving(false);
    }
  }

  async function changeStatus(task, nextStatus) {
    if (!nextStatus || task.status === nextStatus) return;
    setMovingId(task.id);
    setBoardError('');
    try {
      const saved = await api.updateTaskStatus(task.id, nextStatus);
      setTasks((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
    } catch (error) {
      setBoardError(toApiErrorMessage(error, 'Could not move the task.'));
    } finally {
      setMovingId(null);
    }
  }

  async function deleteTaskConfirmed() {
    if (!confirmDeleteTask) return;
    setBusy(true);
    try {
      await api.deleteTask(confirmDeleteTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== confirmDeleteTask.id));
      setConfirmDeleteTask(null);
      if (modal?.task?.id === confirmDeleteTask.id) setModal(null);
    } catch (error) {
      setBoardError(toApiErrorMessage(error, 'Could not delete the task.'));
    } finally {
      setBusy(false);
    }
  }

  async function createMember(name) {
    setMemberBusy(true);
    setMemberError('');
    try {
      const created = await api.createMember({ name });
      setMembers((prev) => [...prev, created]);
      return true;
    } catch (error) {
      setMemberError(toApiErrorMessage(error, 'Could not add the member.'));
      return false;
    } finally {
      setMemberBusy(false);
    }
  }

  async function deleteMemberConfirmed() {
    if (!confirmDeleteMember) return;
    setBusy(true);
    try {
      await api.deleteMember(confirmDeleteMember.id);
      setMembers((prev) => prev.filter((m) => m.id !== confirmDeleteMember.id));
      setConfirmDeleteMember(null);
    } catch (error) {
      setMemberError(toApiErrorMessage(error, 'Could not delete the member.'));
      setConfirmDeleteMember(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="toolbar">
        <div>
          <h2>Shared board</h2>
          <p>{tasks.length} task(s) · {members.length} member(s) · API mode: {apiMode}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn secondary" onClick={load} disabled={loading}>Refresh</button>
          <button type="button" className="btn" onClick={() => openCreate()}>Add Task</button>
        </div>
      </div>

      <ErrorMessage message={boardError} onRetry={load} />
      {loading ? <LoadingState /> : null}
      {!loading && tasks.length === 0 ? (
        <div className="empty">The board is empty. Create the first task to get started.</div>
      ) : null}

      {!loading ? (
        <div className="board">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.status}
              title={column.title}
              status={column.status}
              tasks={grouped[column.status]}
              movingId={movingId}
              onDropTask={(taskId, status) => {
                const task = tasks.find((t) => t.id === taskId);
                if (task) changeStatus(task, status);
              }}
              onEdit={openEdit}
              onStatusChange={changeStatus}
              onDelete={setConfirmDeleteTask}
            />
          ))}
        </div>
      ) : null}

      <TeamMemberPanel
        members={members}
        busy={memberBusy}
        error={memberError}
        onCreate={createMember}
        onDelete={setConfirmDeleteMember}
      />

      {modal ? (
        <TaskModal
          mode={modal.mode}
          initialTask={modal.task}
          members={members}
          saving={modalSaving}
          serverError={modalError}
          onSave={saveModal}
          onClose={() => setModal(null)}
        />
      ) : null}

      {confirmDeleteTask ? (
        <ConfirmDialog
          title="Delete task?"
          message={`Delete "${confirmDeleteTask.title}"? This cannot be undone.`}
          confirmLabel="Delete task"
          busy={busy}
          onCancel={() => setConfirmDeleteTask(null)}
          onConfirm={deleteTaskConfirmed}
        />
      ) : null}

      {confirmDeleteMember ? (
        <ConfirmDialog
          title="Remove team member?"
          message={`Remove ${confirmDeleteMember.name} from the team?`}
          confirmLabel="Remove member"
          busy={busy}
          onCancel={() => setConfirmDeleteMember(null)}
          onConfirm={deleteMemberConfirmed}
        />
      ) : null}
    </>
  );
}

