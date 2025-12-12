import type { Task } from '../types/task';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string, createdAt: string) => void;
  isLoading: boolean;
}

export function TaskList({ tasks, onEdit, onDelete, isLoading }: TaskListProps) {
  if (isLoading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return <div className="empty-state">No tasks yet. Create your first task!</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={`${task.id}-${task.createdAt}`} className="task-item">
          <div className="task-content">
            <h3>{task.title}</h3>
            <p>{task.content}</p>
            <small className="task-date">
              {new Date(parseInt(task.createdAt)).toLocaleString()}
            </small>
          </div>
          <div className="task-actions">
            <button
              onClick={() => onEdit(task)}
              className="btn btn-edit"
              aria-label="Edit task"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id, task.createdAt)}
              className="btn btn-delete"
              aria-label="Delete task"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
