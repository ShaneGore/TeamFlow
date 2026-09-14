import { STATUS_LABELS, STATUSES } from '../api/constants.js';
import { PriorityBadge } from './common.jsx';

function formatDueDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export function TaskCard({ task, onEdit, onStatusChange, onDelete, moving }) {
  return (
    <article
      className="card"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', String(task.id));
        event.dataTransfer.effectAllowed = 'move';
        event.currentTarget.classList.add('dragging');
      }}
      onDragEnd={(event) => event.currentTarget.classList.remove('dragging')}
    >
      <div className="card-title">{task.title}</div>
      <div className="card-meta">
        <PriorityBadge value={task.priority} />
        {task.label ? <span className="chip">#{task.label}</span> : null}
        {task.due_date ? <span className="chip">Due {formatDueDate(task.due_date)}</span> : null}
        {task.assignee_name ? <span className="chip">{task.assignee_name}</span> : <span className="chip">Unassigned</span>}
      </div>
      <div className="card-actions">
        <select
          aria-label={`Move ${task.title} to another status`}
          value={task.status}
          disabled={moving}
          onChange={(event) => onStatusChange(task, event.target.value)}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>{STATUS_LABELS[status]}</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" className="btn secondary small" onClick={() => onEdit(task)}>Edit</button>
          <button type="button" className="btn secondary small" onClick={() => onDelete(task)}>Delete</button>
        </div>
      </div>
    </article>
  );
}
