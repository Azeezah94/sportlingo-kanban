import React from 'react';
import { CheckCircle, Clock, AlertCircle, LayoutGrid } from 'lucide-react';
import { isPast, isToday } from 'date-fns';
import { Task } from '../types';

interface Props { tasks: Task[] }

export default function StatsBar({ tasks }: Props) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(t =>
    t.due_date && isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date)) && t.status !== 'done'
  ).length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <LayoutGrid size={14} className="stat-icon" style={{ color: '#6366f1' }} />
        <span className="stat-value">{total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-item">
        <Clock size={14} className="stat-icon" style={{ color: '#f59e0b' }} />
        <span className="stat-value">{inProgress}</span>
        <span className="stat-label">In Progress</span>
      </div>
      <div className="stat-item">
        <CheckCircle size={14} className="stat-icon" style={{ color: '#10b981' }} />
        <span className="stat-value">{done}</span>
        <span className="stat-label">Completed</span>
      </div>
      {overdue > 0 && (
        <div className="stat-item overdue">
          <AlertCircle size={14} className="stat-icon" style={{ color: '#ef4444' }} />
          <span className="stat-value" style={{ color: '#ef4444' }}>{overdue}</span>
          <span className="stat-label">Overdue</span>
        </div>
      )}
      {total > 0 && (
        <div className="stat-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <span className="progress-label">{Math.round((done / total) * 100)}% complete</span>
        </div>
      )}
    </div>
  );
}
