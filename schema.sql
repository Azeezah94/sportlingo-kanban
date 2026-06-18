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

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id    uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content    text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Activity log table
CREATE TABLE IF NOT EXISTS task_activity (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id    uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action     text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- RLS: tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own tasks"    ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- RLS: comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own comments"    ON comments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- RLS: activity
ALTER TABLE task_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own activity"    ON task_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own activity" ON task_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
