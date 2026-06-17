# Sportlingo Kanban Board

A polished, full-featured Kanban task board built with React, TypeScript, and Supabase.

## Setup

### 1. Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `schema.sql`
3. Go to Authentication → Settings → Enable **Anonymous sign-ins**
4. Go to Settings → API and copy your Project URL and anon key

### 2. Environment variables
Create a `.env` file in the root:
```
REACT_APP_SUPABASE_URL=your_project_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run locally
```bash
npm install
npm start
```

### 4. Deploy to Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

## Features
- Drag-and-drop Kanban board (To Do / In Progress / In Review / Done)
- Guest auth via Supabase anonymous sign-in with RLS
- Create, edit, delete tasks
- Priority levels (Low / Normal / High) with color indicators
- Due date badges with overdue/due-soon highlighting
- Labels/tags with custom label support
- Search and priority filtering
- Board stats (total, done, overdue)
- Dark mode UI with smooth interactions
