import { PRIORITY_LABELS } from '../api/constants.js';

export function PriorityBadge({ value }) {
  if (!value) return null;
  return <span className={`chip priority-${value}`}>{PRIORITY_LABELS[value] ?? value}</span>;
}

export function LoadingState({ message = 'Loading board…' }) {
  return <div className="loading" role="status">{message}</div>;
}

export function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="alert error" role="alert">
      <div>{message}</div>
      {onRetry ? (
        <div style={{ marginTop: 8 }}>
          <button type="button" className="btn secondary small" onClick={onRetry}>Retry</button>
        </div>
      ) : null}
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel, busy = false }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="confirm-card">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onCancel} disabled={busy}>Cancel</button>
          <button type="button" className="btn danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
