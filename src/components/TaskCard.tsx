import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Trash2, Pencil, AlertCircle, ArrowUp, ArrowRight, ArrowDown, MessageSquare } from 'lucide-react';
import { Task } from '../supabaseClient';
import { format, isPast, isToday, differenceInDays } from 'date-fns';
import TaskModal from './TaskModal';
import TaskDetail from './TaskDetail';

interface Props {
  task: Task;
  index: number;
  onUpdate: (id: string, updates: Partial<Task>, activity?: string) => void;
  onDelete: (id: string) => void;
  isDragging: boolean;
  userId: string;
}

const PRIORITY_CONFIG = {
  high: { color: 'var(--red)', bg: 'var(--red-dim)', icon: <ArrowUp size={10} />, label: 'High' },
  normal: { color: 'var(--yellow)', bg: 'var(--yellow-dim)', icon: <ArrowRight size={10} />, label: 'Normal' },
  low: { color: 'var(--green)', bg: 'var(--green-dim)', icon: <ArrowDown size={10} />, label: 'Low' },
};

function DueDateBadge({ due_date, status }: { due_date: string; status: string }) {
  const date = new Date(due_date);
  const done = status === 'done';
  const overdue = !done && isPast(date) && !isToday(date);
  const dueSoon = !done && !overdue && differenceInDays(date, new Date()) <= 2;
  let color = 'var(--text-muted)', bg = 'var(--surface2)';
  if (overdue) { color = 'var(--red)'; bg = 'var(--red-dim)'; }
  else if (dueSoon) { color = 'var(--yellow)'; bg = 'var(--yellow-dim)'; }
  else if (done) { color = 'var(--green)'; bg = 'var(--green-dim)'; }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, background: bg, color, fontSize: 11, fontWeight: 500 }}>
      {overdue && <AlertCircle size={10} />}<Calendar size={10} />
      {isToday(date) ? 'Today' : format(date, 'MMM d')}
    </span>
  );
}

export default function TaskCard({ task, index, onUpdate, onDelete, isDragging, userId }: Props) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [hovered, setHovered] = useState(false);
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.normal;

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: snapshot.isDragging ? 'var(--surface2)' : hovered ? '#1e2235' : 'var(--surface2)',
              border: `1px solid ${snapshot.isDragging ? 'var(--accent)' : hovered ? 'var(--border-light)' : 'var(--border)'}`,
              borderRadius: 8, padding: '10px 12px', marginBottom: 8, cursor: 'grab',
              boxShadow: snapshot.isDragging ? '0 8px 32px rgba(108,99,255,0.3)' : 'none',
              transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
              transition: 'background 0.1s, border 0.1s',
              ...provided.draggableProps.style,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <span
                onClick={() => setShowDetail(true)}
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, flex: 1, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-light)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}
              >{task.title}</span>
              {hovered && (
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => setShowDetail(true)} style={{ color: 'var(--text-muted)', padding: 2, borderRadius: 4, display: 'flex' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    <MessageSquare size={12} />
                  </button>
                  <button onClick={() => setShowEdit(true)} style={{ color: 'var(--text-muted)', padding: 2, borderRadius: 4, display: 'flex' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => onDelete(task.id)} style={{ color: 'var(--text-muted)', padding: 2, borderRadius: 4, display: 'flex' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
            {task.description && (
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {task.description}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 20, background: priority.bg, color: priority.color, fontSize: 11, fontWeight: 500 }}>
                {priority.icon} {priority.label}
              </span>
              {task.due_date && <DueDateBadge due_date={task.due_date} status={task.status} />}
              {task.labels?.map(label => (
                <span key={label} style={{ padding: '2px 7px', borderRadius: 20, background: 'var(--accent-dim)', color: 'var(--accent-light)', fontSize: 11, fontWeight: 500 }}>{label}</span>
              ))}
            </div>
          </div>
        )}
      </Draggable>

      {showEdit && (
        <TaskModal task={task} onClose={() => setShowEdit(false)}
          onSave={(updates) => {
            onUpdate(task.id, updates, 'Task details updated');
            setShowEdit(false);
          }} />
      )}
      {showDetail && (
        <TaskDetail task={task} userId={userId} onClose={() => setShowDetail(false)} onUpdate={onUpdate} />
      )}
    </>
  );
}
