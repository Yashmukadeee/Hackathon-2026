# Board.ai — Smart Campus Notice Board

An AI-powered campus notice board built with **React + Vite**, **Supabase** (database, auth, realtime), and **Gemini AI** (backend AI features via Express).

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime |
| Backend | Express.js + Node.js |
| AI | Google Gemini 2.0 Flash |

---

## Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A free [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the entire contents of `supabase-schema.sql`.
3. Go to **Authentication → Providers** and enable **Google**.
4. Under **Authentication → URL Configuration**, add `http://localhost:3000` to the **Site URL** and **Redirect URLs**.

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GEMINI_API_KEY=AIza...
```

> Find your Supabase keys at: **Project Settings → API**

### 4. Run the Backend (Terminal 1)

```bash
cd smart-campus-notice-board
npm run server
```

Starts the Express AI server on `http://localhost:3001`.

### 5. Run the Frontend (Terminal 2)

```bash
cd smart-campus-notice-board
npm run dev
```

Opens the app on `http://localhost:3000`.

---

## Features

### Role-Based Access
| Role | Can View | Can Post | Can Delete Others |
|------|----------|----------|-------------------|
| Student | ✅ | ❌ | ❌ |
| Faculty | ✅ | ✅ | ❌ |
| DeptAdmin | ✅ | ✅ | ✅ |
| SuperAdmin | ✅ | ✅ | ✅ |

> To assign a role, update the `role` column in the `users` table in Supabase Table Editor.

### AI Features
- **Auto-Summarize**: When a notice is posted, Gemini generates a 2-sentence preview.
- **Auto-Classify Urgency**: Gemini classifies notices as `Critical`, `Important`, `Normal`, or `Info`.
- **Campus AI Chat (RAG)**: The floating chat widget answers student questions based on live notice data.

### Realtime Updates
The board uses **Supabase Realtime** to push new notices instantly to all connected users — no page refresh needed.
