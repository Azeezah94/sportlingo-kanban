import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Priority = 'low' | 'normal' | 'high';
export type Status = 'todo' | 'in_progress' | 'in_review' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  due_date?: string;
  user_id: string;
  created_at: string;
  labels?: string[];
}
