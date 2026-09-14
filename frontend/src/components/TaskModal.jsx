import { useEffect, useState } from 'react';
import { PRIORITIES, PRIORITY_LABELS, STATUSES, STATUS_LABELS } from '../api/constants.js';

const emptyForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: '',
  due_date: '',
  label: '',
  assignee_id: '',
};

function toForm(task) {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'todo',
    priority: task?.priority ?? '',
    due_date: task?.due_date ?? '',
    label: task?.label ?? '',
    assignee_id: task?.assignee_id === null || task?.assignee_id === undefined ? '' : String(task.assignee_id),
  };
}

export function TaskModal({ mode, initialTask, members, saving, serverError, onSave, onClose }) {
  const [form, setForm] = useState(() => toForm(initialTask));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(toForm(initialTask));
    setErrors({});
  }, [initialTask, mode]);

  function set(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    else if (form.title.trim().length > 200) next.title = 'Title must be 200 characters or fewer.';
    if (!STATUSES.includes(form.status)) next.status = 'Choose a valid status.';
    if (form.priority && !PRIORITIES.includes(form.priority)) next.priority = 'Choose a valid priority.';
    if (form.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(form.due_date)) next.due_date = 'Use YYYY-MM-DD format.';
    if (form.label.trim().length > 60) next.label = 'Label must be 60 characters or fewer.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(event) {
    event.preventDefault();
    if (!validate()) return;
    onSave({
      title: form.title.trim(),
      description: form.description,
      status: form.status,
      priority: form.priority || null,
      due_date: form.due_date || null,
      label: form.label.trim(),
      assignee_id: form.assignee_id === '' ? null : Number(form.assignee_id),
    });
  }

  const fieldErrors = { ...errors, ...(serverError?.details || {}) };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={mode === 'edit' ? 'Edit task' : 'Add task'}>
      <div className="modal-card">
        <h2>{mode === 'edit' ? 'Edit task' : 'Add task'}</h2>
        <form className="form-grid" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="task-title">Title *</label>
            <input id="task-title" value={form.title} onChange={(e) => set('title', e.target.value)} maxLength={200} autoFocus />
            {fieldErrors.title ? <span className="field-error">{fieldErrors.title}</span> : null}
          </div>

          <div className="field">
            <label htmlFor="task-description">Description</label>
            <textarea id="task-description" value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>

          <div className="field two">
            <div className="field">
              <label htmlFor="task-status">Status</label>
              <select id="task-status" value={form.status} onChange={(e) => set('status', e.target.value)}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                ))}
              </select>
              {fieldErrors.status ? <span className="field-error">{fieldErrors.status}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
                <option value="">None</option>
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>{PRIORITY_LABELS[priority]}</option>
                ))}
              </select>
              {fieldErrors.priority ? <span className="field-error">{fieldErrors.priority}</span> : null}
            </div>
          </div>

          <div className="field two">
            <div className="field">
              <label htmlFor="task-due">Due date</label>
              <input id="task-due" type="date" value={form.due_date} onChange={(e) => set('due_date', e.target.value)} />
              {fieldErrors.due_date ? <span className="field-error">{fieldErrors.due_date}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="task-label">Label</label>
              <input id="task-label" value={form.label} onChange={(e) => set('label', e.target.value)} maxLength={60} placeholder="frontend" />
              {fieldErrors.label ? <span className="field-error">{fieldErrors.label}</span> : null}
            </div>
          </div>

          <div className="field">
            <label htmlFor="task-assignee">Assignee</label>
            <select id="task-assignee" value={form.assignee_id} onChange={(e) => set('assignee_id', e.target.value)}>
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            {fieldErrors.assignee_id ? <span className="field-error">{fieldErrors.assignee_id}</span> : null}
          </div>

          {serverError?.message ? <div className="alert error">{serverError.message}</div> : null}

          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
