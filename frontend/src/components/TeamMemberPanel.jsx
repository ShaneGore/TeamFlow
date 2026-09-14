import { useState } from 'react';

export function TeamMemberPanel({ members, busy, error, onCreate, onDelete }) {
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');

  async function submit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setLocalError('Enter a team member name.');
      return;
    }
    setLocalError('');
    const created = await onCreate(trimmed);
    if (created) setName('');
  }

  return (
    <section className="members" aria-label="Team members">
      <div>
        <h2>Team members</h2>
        <p style={{ margin: '4px 0 0', color: '#687385', fontSize: 14 }}>
          Members appear in the task assignee dropdown. A member with assigned tasks cannot be deleted.
        </p>
      </div>

      <form className="member-row" onSubmit={submit}>
        <input
          aria-label="New team member name"
          value={name}
          maxLength={80}
          placeholder="Add a teammate, e.g. Dana"
          onChange={(event) => setName(event.target.value)}
        />
        <button type="submit" className="btn" disabled={busy}>{busy ? 'Adding…' : 'Add member'}</button>
      </form>

      {localError ? <div className="alert error">{localError}</div> : null}
      {error ? <div className="alert error">{error}</div> : null}

      {members.length === 0 ? (
        <div className="empty">No team members yet. Add the first teammate above.</div>
      ) : (
        <ul className="member-list">
          {members.map((member) => (
            <li key={member.id}>
              <span>{member.name}</span>
              <button
                type="button"
                className="btn secondary small"
                onClick={() => onDelete(member)}
                title={`Delete ${member.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
