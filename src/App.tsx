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
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) setTasks(data as Task[]);
    setLoading(false);
  };

  const createTask = async (task: Omit<Task, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return;
    const { data, error } = await supabase.from('tasks').insert([{ ...task, user_id: userId }]).select().single();
    if (!error && data) setTasks(prev => [...prev, data as Task]);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
    if (!error && data) setTasks(prev => prev.map(t => t.id === id ? data as Task : t));
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = async (id: string, status: Status) => {
    await updateTask(id, { status });
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority ? t.priority === filterPriority : true;
    return matchSearch && matchPriority;
  });

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => {
      if (!t.due_date || t.status === 'done') return false;
      return new Date(t.due_date) < new Date();
    }).length
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header
        search={search}
        setSearch={setSearch}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
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
        <Board
          tasks={filtered}
          onMove={moveTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onCreate={createTask}
        />
      )}
    </div>
  );
}
