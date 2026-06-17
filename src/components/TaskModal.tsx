import React, { useState } from 'react';
import { X, Tag, Plus } from 'lucide-react';
import { Task, Status, Priority } from '../supabaseClient';

interface Props {
  task?: Task;
  defaultStatus?: Status;
  onClose: () => void;
  onSave: (t: Omit<Task, 'id' | 'user_id' | 'created_at'>) => void;
}

const LABEL_SUGGESTIONS = ['Bug', 'Feature', 'Design', 'Research', 'Blocked', 'Urgent'];

export default function TaskModal({ task, defaultStatus, onClose, onSave }: Props) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<Status>(task?.status || defaultStatus || 'todo');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'normal');
  const [dueDate, setDueDate] = useState(task?.due_date ? task.due_date.split('T')[0] : '');
  const [labels, setLabels] = useState<string[]>(task?.labels || []);
  const [labelInput, setLabelInput] = useState('');
  const [error, setError] = useState('');

  const toggleLabel = (l: string) => setLabels(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);

  const addCustomLabel = () => {
    const val = labelInput.trim();
    if (val && !labels.includes(val)) { setLabels(prev => [...prev, val]); setLabelInput(''); }
  };

  const handleSave = () => {
    if (!title.trim()) { setError('Title is required'); return; }
    onSave({ title: title.trim(), description, status, priority, due_date: dueDate || undefined, labels });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, width: '100%', maxWidth: 480, boxShadow: 'var(--shadow)' }}>
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{task ? 'Edit Task' : 'New Task'}</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', display: 'flex', borderRadius: 6, padding: 4 }}><X size={16} /></button>
        </div>

        {/* Form */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              placeholder="What needs to be done?"
              style={{ ...inputStyle, border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}` }}
              autoFocus
            />
            {error && <span style={{ color: 'var(--red)', fontSize: 11, marginTop: 4, display: 'block' }}>{error}</span>}
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more context..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Status + Priority row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as Status)} style={inputStyle}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as Priority)} style={inputStyle}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label style={labelStyle}>Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle} />
          </div>

          {/* Labels */}
          <div>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 5 }}><Tag size={11} /> Labels</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {LABEL_SUGGESTIONS.map(l => (
                <button key={l} onClick={() => toggleLabel(l)}
                  style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: labels.includes(l) ? 'var(--accent)' : 'var(--surface2)', color: labels.includes(l) ? 'white' : 'var(--text-muted)', border: `1px solid ${labels.includes(l) ? 'var(--accent)' : 'var(--border)'}` }}>
                  {l}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={labelInput} onChange={e => setLabelInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustomLabel()} placeholder="Custom label..." style={{ ...inputStyle, flex: 1, padding: '6px 10px' }} />
              <button onClick={addCustomLabel} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <Plus size={12} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '8px 20px', borderRadius: 8, background: 'var(--accent)', color: 'white', fontSize: 13, fontWeight: 600 }}>{task ? 'Save Changes' : 'Create Task'}</button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 5 };
const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontSize: 13, outline: 'none' };
