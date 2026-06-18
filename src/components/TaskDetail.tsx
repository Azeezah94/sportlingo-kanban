import React, { useEffect, useState } from 'react';
import { X, Send, Clock, MessageSquare } from 'lucide-react';
import { supabase, Task, Comment, Activity } from '../supabaseClient';
import { format, formatDistanceToNow } from 'date-fns';

interface Props {
  task: Task;
  userId: string;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>, activity?: string) => void;
}

export default function TaskDetail({ task, userId, onClose, onUpdate }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [newComment, setNewComment] = useState('');
  const [tab, setTab] = useState<'comments' | 'activity'>('comments');
  const [loading, setLoading] = useState(true);

  useEffect(() => {  // eslint-disable-next-line
    fetchData();
  }, [task.id]);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: c }, { data: a }] = await Promise.all([
      supabase.from('comments').select('*').eq('task_id', task.id).order('created_at', { ascending: true }),
      supabase.from('task_activity').select('*').eq('task_id', task.id).order('created_at', { ascending: false }),
    ]);
    if (c) setComments(c as Comment[]);
    if (a) setActivity(a as Activity[]);
    setLoading(false);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    const { data, error } = await supabase.from('comments').insert([{ task_id: task.id, user_id: userId, content: newComment.trim() }]).select().single();
    if (!error && data) {
      setComments(prev => [...prev, data as Comment]);
      setNewComment('');
    }
  };

  const STATUS_LABELS: Record<string, string> = { todo: 'To Do', in_progress: 'In Progress', in_review: 'In Review', done: 'Done' };
  const PRIORITY_COLORS: Record<string, string> = { high: 'var(--red)', normal: 'var(--yellow)', low: 'var(--green)' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, width: '100%', maxWidth: 560, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow)' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{task.title}</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ padding: '3px 10px', borderRadius: 20, background: 'var(--surface2)', color: 'var(--text-muted)', fontSize: 12 }}>{STATUS_LABELS[task.status]}</span>
              <span style={{ padding: '3px 10px', borderRadius: 20, background: 'var(--surface2)', color: PRIORITY_COLORS[task.priority], fontSize: 12, fontWeight: 500 }}>{task.priority}</span>
              {task.due_date && <span style={{ padding: '3px 10px', borderRadius: 20, background: 'var(--surface2)', color: 'var(--text-muted)', fontSize: 12 }}>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>}
              {task.labels?.map(l => <span key={l} style={{ padding: '3px 10px', borderRadius: 20, background: 'var(--accent-dim)', color: 'var(--accent-light)', fontSize: 12 }}>{l}</span>)}
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', display: 'flex', borderRadius: 6, padding: 4 }}><X size={16} /></button>
        </div>

        {/* Description */}
        {task.description && (
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{task.description}</p>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 20px' }}>
          {(['comments', 'activity'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 16px', fontSize: 13, fontWeight: tab === t ? 600 : 400, color: tab === t ? 'var(--accent)' : 'var(--text-muted)', borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`, display: 'flex', alignItems: 'center', gap: 6, marginBottom: -1 }}>
              {t === 'comments' ? <MessageSquare size={13} /> : <Clock size={13} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'comments' && comments.length > 0 && <span style={{ background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: 10, padding: '1px 6px', borderRadius: 10 }}>{comments.length}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 13, padding: 20 }}>Loading...</div>
          ) : tab === 'comments' ? (
            <>
              {comments.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 13, padding: '20px 0' }}>No comments yet. Be the first to add one.</div>}
              {comments.map(c => (
                <div key={c.id} style={{ marginBottom: 12, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>
                    {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{c.content}</p>
                </div>
              ))}
            </>
          ) : (
            <>
              {activity.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 13, padding: '20px 0' }}>No activity yet.</div>}
              {activity.map(a => (
                <div key={a.id} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, color: 'var(--text)' }}>{a.action}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Comment input */}
        {tab === 'comments' && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addComment()}
              placeholder="Add a comment..."
              style={{ flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontSize: 13, outline: 'none' }}
            />
            <button onClick={addComment} style={{ background: 'var(--accent)', borderRadius: 8, padding: '8px 14px', color: 'white', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600 }}>
              <Send size={13} /> Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
