import { useState } from 'react';
import { TaskCard } from './TaskCard.jsx';

export function KanbanColumn({ title, status, tasks, onDropTask, onEdit, onStatusChange, onDelete, movingId }) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <section
      className={`column${dragOver ? ' drag-over' : ''}`}
      data-status={status}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragOver(false);
        const taskId = event.dataTransfer.getData('text/plain');
        if (taskId) onDropTask(Number(taskId), status);
      }}
    >
      <div className="column-head">
        <h3>{title}</h3>
        <span className="count">{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <div className="empty">No tasks yet. Drag one here or create it in this column.</div>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            moving={movingId === task.id}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))
      )}
    </section>
  );
}
