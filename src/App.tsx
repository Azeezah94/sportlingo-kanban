import React, { useEffect, useState } from 'react';
import { supabase, Task, Status } from './supabaseClient';
import Board from './components/Board';
import Header from './components/Header';
import './index.css';

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterLabel, setFilterLabel] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (!error && data.user) setUserId(data.user.id);
      }
    };
    init();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUserId(session.user.id);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: true });
    if (!error && data) setTasks(data as Task[]);
    setLoading(false);
  };

  const createTask = async (task: Omit<Task, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return;
    const { data, error } = await supabase.from('tasks').insert([{ ...task, user_id: userId }]).select().single();
    if (!error && data) {
      setTasks(prev => [...prev, data as Task]);
      await supabase.from('task_activity').insert([{ task_id: data.id, user_id: userId, action: 'Task created' }]);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>, activityMsg?: string) => {
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
    if (!error && data) {
      setTasks(prev => prev.map(t => t.id === id ? data as Task : t));
      if (activityMsg && userId) {
        await supabase.from('task_activity').insert([{ task_id: id, user_id: userId, action: activityMsg }]);
      }
    }
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = async (id: string, newStatus: Status) => {
    const task = tasks.find(t => t.id === id);
    const statusLabels: Record<Status, string> = { todo: 'To Do', in_progress: 'In Progress', in_review: 'In Review', done: 'Done' };
    const msg = `Moved from ${statusLabels[task?.status || 'todo']} to ${statusLabels[newStatus]}`;
    await updateTask(id, { status: newStatus }, msg);
  };

  // Collect all unique labels for filter
  const allLabels = Array.from(new Set(tasks.flatMap(t => t.labels || [])));

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority ? t.priority === filterPriority : true;
    const matchLabel = filterLabel ? (t.labels || []).includes(filterLabel) : true;
    return matchSearch && matchPriority && matchLabel;
  });

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => {
      if (!t.due_date || t.status === 'done') return false;
      const todayStr = new Date().toISOString().split("T")[0]; return t.due_date < todayStr;
    }).length
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header
        search={search} setSearch={setSearch}
        filterPriority={filterPriority} setFilterPriority={setFilterPriority}
        filterLabel={filterLabel} setFilterLabel={setFilterLabel}
        allLabels={allLabels}
        stats={stats}
        onCreateTask={createTask}
      />
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading your board...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <Board tasks={filtered} onMove={moveTask} onUpdate={updateTask} onDelete={deleteTask} onCreate={createTask} userId={userId || ''} />
      )}
    </div>
  );
}
