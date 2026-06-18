import React, { useState } from 'react';
import { DroppableProvided } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Task, Status } from '../supabaseClient';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

interface ColDef { id: Status; label: string; color: string }
interface Props {
  column: ColDef; tasks: Task[]; provided: DroppableProvided;
  isDraggingOver: boolean; draggingId: string | null;
  onUpdate: (id: string, updates: Partial<Task>, activity?: string) => void;
  onDelete: (id: string) => void;
  onCreate: (t: Omit<Task, 'id' | 'user_id' | 'created_at'>) => void;
  userId: string;
}

export default function Column({ column, tasks, provided, isDraggingOver, draggingId, onUpdate, onDelete, onCreate, userId }: Props) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div style={{ width: 280, minWidth: 280, background: isDraggingOver ? 'rgba(108,99,255,0.06)' : 'var(--surface)', border: `1px solid ${isDraggingOver ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 12, display: 'flex', flexDirection: 'column', transition: 'all 0.15s ease', maxHeight: 'calc(100vh - 100px)' }}>
        <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: column.color }} />
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{column.label}</span>
            <span style={{ background: 'var(--surface2)', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 20 }}>{tasks.length}</span>
          </div>
          <button onClick={() => setShowModal(true)} style={{ color: 'var(--text-dim)', borderRadius: 6, padding: 4, display: 'flex' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}>
            <Plus size={15} />
          </button>
        </div>
        <div ref={provided.innerRef} {...provided.droppableProps} style={{ padding: '4px 10px 10px', overflowY: 'auto', flexGrow: 1, minHeight: 60 }}>
          {tasks.length === 0 && !isDraggingOver && (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: 12 }}>No tasks yet</div>
          )}
          {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} onUpdate={onUpdate} onDelete={onDelete} isDragging={draggingId === task.id} userId={userId} />
          ))}
          {provided.placeholder}
        </div>
      </div>
      {showModal && <TaskModal defaultStatus={column.id} onClose={() => setShowModal(false)} onSave={(t) => { onCreate(t); setShowModal(false); }} />}
    </>
  );
}
