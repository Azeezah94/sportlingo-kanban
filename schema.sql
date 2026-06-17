-- ============================================================
-- Sportlingo Kanban Board — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  description text,
  status      text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','in_review','done')),
  priority    text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high')),
  due_date    date,
  labels      text[],
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own tasks
CREATE POLICY "Users see own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: users can insert their own tasks
CREATE POLICY "Users insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can update their own tasks
CREATE POLICY "Users update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: users can delete their own tasks
CREATE POLICY "Users delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);
