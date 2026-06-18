import React, { useState } from 'react';
import { Search, Plus, SlidersHorizontal, CheckCircle2, AlertCircle, LayoutDashboard, Tag } from 'lucide-react';
import { Task } from '../supabaseClient';
import TaskModal from './TaskModal';

interface Props {
  search: string; setSearch: (s: string) => void;
  filterPriority: string; setFilterPriority: (p: string) => void;
  filterLabel: string; setFilterLabel: (l: string) => void;
  allLabels: string[];
  stats: { total: number; done: number; overdue: number };
  onCreateTask: (t: Omit<Task, 'id' | 'user_id' | 'created_at'>) => void;
}

export default function Header({ search, setSearch, filterPriority, setFilterPriority, filterLabel, setFilterLabel, allLabels, stats, onCreateTask }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={17} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>Sportlingo</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: -2 }}>Task Board</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--green)', fontSize: 12, fontWeight: 500 }}>
              <CheckCircle2 size={13} />{stats.done}/{stats.total} done
            </div>
            {stats.overdue > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--red)', fontSize: 12, fontWeight: 500 }}>
                <AlertCircle size={13} />{stats.overdue} overdue
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 12px 7px 30px', color: 'var(--text)', fontSize: 13, width: 200, outline: 'none' }} />
            </div>
            <button onClick={() => setShowFilters(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: showFilters ? 'var(--accent-dim)' : 'var(--surface2)', border: `1px solid ${showFilters ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, padding: '7px 12px', color: showFilters ? 'var(--accent)' : 'var(--text-muted)', fontSize: 13 }}>
              <SlidersHorizontal size={14} /> Filter
            </button>
            <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', borderRadius: 8, padding: '7px 14px', color: 'white', fontSize: 13, fontWeight: 600 }}>
              <Plus size={15} /> New Task
            </button>
          </div>
        </div>
        {showFilters && (
          <div style={{ paddingBottom: 12, display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Priority:</span>
              {['', 'low', 'normal', 'high'].map(p => (
                <button key={p} onClick={() => setFilterPriority(p)} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: filterPriority === p ? 'var(--accent)' : 'var(--surface2)', color: filterPriority === p ? 'white' : 'var(--text-muted)', border: `1px solid ${filterPriority === p ? 'var(--accent)' : 'var(--border)'}` }}>
                  {p === '' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            {allLabels.length > 0 && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Tag size={11} />Label:</span>
                <button onClick={() => setFilterLabel('')} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: filterLabel === '' ? 'var(--accent)' : 'var(--surface2)', color: filterLabel === '' ? 'white' : 'var(--text-muted)', border: `1px solid ${filterLabel === '' ? 'var(--accent)' : 'var(--border)'}` }}>All</button>
                {allLabels.map(l => (
                  <button key={l} onClick={() => setFilterLabel(l)} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: filterLabel === l ? 'var(--accent)' : 'var(--surface2)', color: filterLabel === l ? 'white' : 'var(--text-muted)', border: `1px solid ${filterLabel === l ? 'var(--accent)' : 'var(--border)'}` }}>{l}</button>
                ))}
              </div>
            )}
          </div>
        )}
      </header>
      {showModal && <TaskModal onClose={() => setShowModal(false)} onSave={(t) => { onCreateTask(t); setShowModal(false); }} />}
    </>
  );
}
