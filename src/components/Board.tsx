import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Task, Status } from '../supabaseClient';
import Column from './Column';

const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: '#6c63ff' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'in_review', label: 'In Review', color: '#3b82f6' },
  { id: 'done', label: 'Done', color: '#22c55e' },
];

interface Props {
  tasks: Task[];
  onMove: (id: string, status: Status) => void;
  onUpdate: (id: string, updates: Partial<Task>, activity?: string) => void;
  onDelete: (id: string) => void;
  onCreate: (t: Omit<Task, 'id' | 'user_id' | 'created_at'>) => void;
  userId: string;
}

export default function Board({ tasks, onMove, onUpdate, onDelete, onCreate, userId }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const onDragStart = (start: any) => setDraggingId(start.draggableId);
  const onDragEnd = (result: DropResult) => {
    setDraggingId(null);
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as Status;
    const task = tasks.find(t => t.id === result.draggableId);
    if (task && task.status !== newStatus) onMove(result.draggableId, newStatus);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: 16, padding: '24px', overflowX: 'auto', minHeight: 'calc(100vh - 61px)', alignItems: 'flex-start' }}>
        {COLUMNS.map(col => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided, snapshot) => (
              <Column column={col} tasks={tasks.filter(t => t.status === col.id)} provided={provided} isDraggingOver={snapshot.isDraggingOver} draggingId={draggingId} onUpdate={onUpdate} onDelete={onDelete} onCreate={onCreate} userId={userId} />
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
