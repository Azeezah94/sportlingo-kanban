import React, { useState } from 'react';
import { Search, Plus, SlidersHorizontal, CheckCircle2, AlertCircle, LayoutDashboard } from 'lucide-react';
import { Task } from '../supabaseClient';
import TaskModal from './TaskModal';

interface Props {
  search: string;
  setSearch: (s: string) => void;
  filterPriority: string;
  setFilterPriority: (p: string) => void;
  stats: { total: number; done: number; overdue: number };
  onCreateTask: (t: Omit<Task, 'id' | 'user_id' | 'created_at'>) => void;
}

export default function Header({ search, setSearch, filterPriority, setFilterPriority, stats, onCreateTask }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={17} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: 'var(--text)', letterSpacing: '-0.3px' }}>Sportlingo</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: -2 }}>Task Board</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <StatChip icon={<CheckCircle2 size={13} />} label={`${stats.done}/${stats.total} done`} color="var(--green)" />
            {stats.overdue > 0 && <StatChip icon={<AlertCircle size={13} />} label={`${stats.overdue} overdue`} color="var(--red)" />}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tasks..."
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 12px 7px 30px', color: 'var(--text)', fontSize: 13, width: 200, outline: 'none' }}
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(f => !f)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: showFilters ? 'var(--accent-dim)' : 'var(--surface2)', border: `1px solid ${showFilters ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, padding: '7px 12px', color: showFilters ? 'var(--accent)' : 'var(--text-muted)', fontSize: 13 }}
            >
              <SlidersHorizontal size={14} /> Filter
            </button>

            {/* New task */}
            <button
              onClick={() => setShowModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', borderRadius: 8, padding: '7px 14px', color: 'white', fontSize: 13, fontWeight: 600 }}
            >
              <Plus size={15} /> New Task
            </button>
          </div>
        </div>

        {/* Filter bar */}
        {showFilters && (
          <div style={{ paddingBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Priority:</span>
            {['', 'low', 'normal', 'high'].map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: filterPriority === p ? 'var(--accent)' : 'var(--surface2)', color: filterPriority === p ? 'white' : 'var(--text-muted)', border: `1px solid ${filterPriority === p ? 'var(--accent)' : 'var(--border)'}` }}
              >
                {p === '' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        )}
      </header>

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSave={(t) => { onCreateTask(t); setShowModal(false); }}
        />
      )}
    </>
  );
}

function StatChip({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color, fontSize: 12, fontWeight: 500 }}>
      {icon} {label}
    </div>
  );
}
