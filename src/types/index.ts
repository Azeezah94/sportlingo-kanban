export type Status = 'todo' | 'in_progress' | 'in_review' | 'done';
export type Priority = 'low' | 'normal' | 'high';

export interface Label {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

export interface TeamMember {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

export interface Comment {
  id: string;
  task_id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export interface ActivityLog {
  id: string;
  task_id: string;
  action: string;
  created_at: string;
  user_id: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  due_date?: string;
  user_id: string;
  created_at: string;
  assignee_id?: string;
  label_ids?: string[];
  team_member?: TeamMember;
  labels?: Label[];
}

export const COLUMNS: { id: Status; label: string; color: string; bg: string }[] = [
  { id: 'todo',        label: 'To Do',      color: '#94a3b8', bg: '#f8fafc' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b', bg: '#fffbeb' },
  { id: 'in_review',   label: 'In Review',  color: '#8b5cf6', bg: '#faf5ff' },
  { id: 'done',        label: 'Done',       color: '#10b981', bg: '#f0fdf4' },
];
