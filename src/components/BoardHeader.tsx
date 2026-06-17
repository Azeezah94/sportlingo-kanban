import React, { useState } from 'react';
import { Search, Users, Tag, ChevronDown } from 'lucide-react';
import { Label, TeamMember } from '../types';
import { supabase } from '../lib/supabase';

interface Props {
  search: string; setSearch: (v: string) => void;
  filterPriority: string; setFilterPriority: (v: string) => void;
  filterLabel: string; setFilterLabel: (v: string) => void;
  labels: Label[];
  members: TeamMember[];
  userId: string;
  onMembersChange: () => void;
  onLabelsChange: () => void;
}

const MEMBER_COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6'];
const LABEL_COLORS  = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#a855f7','#ec4899'];

export default function BoardHeader(props: Props) {
  const { search, setSearch, filterPriority, setFilterPriority,
          filterLabel, setFilterLabel, labels, members, userId,
          onMembersChange, onLabelsChange } = props;

  const [showTeam, setShowTeam] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [newMember, setNewMember] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0]);

  const addMember = async () => {
    if (!newMember.trim()) return;
    const color = MEMBER_COLORS[members.length % MEMBER_COLORS.length];
    await supabase.from('team_members').insert({ name: newMember.trim(), color, user_id: userId });
    setNewMember('');
    onMembersChange();
  };

  const addLabel = async () => {
    if (!newLabel.trim()) return;
    await supabase.from('labels').insert({ name: newLabel.trim(), color: newLabelColor, user_id: userId });
    setNewLabel('');
    onLabelsChange();
  };

  const deleteMember = async (id: string) => {
    await supabase.from('team_members').delete().eq('id', id);
    onMembersChange();
  };

  const deleteLabel = async (id: string) => {
    await supabase.from('labels').delete().eq('id', id);
    onLabelsChange();
  };

  return (
    <header className="board-header">
      <div className="header-left">
        <div className="brand">
          <span className="brand-sport">Sport</span><span className="brand-lingo">lingo</span>
          <span className="brand-sep" />
          <span className="brand-board">Task Board</span>
        </div>
      </div>
      <div className="header-controls">
        <div className="search-box">
          <Search size={14} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
        <select className="filter-select" value={filterLabel} onChange={e => setFilterLabel(e.target.value)}>
          <option value="all">All labels</option>
          {labels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <div className="header-btn-group">
          <button className="header-btn" onClick={() => { setShowTeam(!showTeam); setShowLabels(false); }}>
            <Users size={14} /> Team <ChevronDown size={12} />
          </button>
          <button className="header-btn" onClick={() => { setShowLabels(!showLabels); setShowTeam(false); }}>
            <Tag size={14} /> Labels <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {showTeam && (
        <div className="dropdown-panel">
          <div className="panel-title">Team Members</div>
          <div className="panel-list">
            {members.map(m => (
              <div key={m.id} className="panel-item">
                <span className="avatar-sm" style={{ background: m.color }}>{m.name[0]}</span>
                <span>{m.name}</span>
                <button className="panel-delete" onClick={() => deleteMember(m.id)}>×</button>
              </div>
            ))}
          </div>
          <div className="panel-add-row">
            <input className="panel-input" placeholder="Member name" value={newMember} onChange={e => setNewMember(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addMember()} />
            <button className="panel-add-btn" onClick={addMember}>Add</button>
          </div>
        </div>
      )}
      {showLabels && (
        <div className="dropdown-panel">
          <div className="panel-title">Labels</div>
          <div className="panel-list">
            {labels.map(l => (
              <div key={l.id} className="panel-item">
                <span className="label-dot" style={{ background: l.color }} />
                <span>{l.name}</span>
                <button className="panel-delete" onClick={() => deleteLabel(l.id)}>×</button>
              </div>
            ))}
          </div>
          <div className="panel-add-row">
            <input className="panel-input" placeholder="Label name" value={newLabel} onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addLabel()} />
            <div className="color-swatches">
              {LABEL_COLORS.map(c => (
                <span key={c} className={`swatch ${newLabelColor === c ? 'selected' : ''}`}
                  style={{ background: c }} onClick={() => setNewLabelColor(c)} />
              ))}
            </div>
            <button className="panel-add-btn" onClick={addLabel}>Add</button>
          </div>
        </div>
      )}
    </header>
  );
}
