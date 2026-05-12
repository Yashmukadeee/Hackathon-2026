-- ============================================
-- Smart Campus Notice Board - Ultra-Stable Schema
-- Optimized for Hackathon Goa 2026
-- ============================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users table (Refactored for Reliability)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Campus User',
  role TEXT NOT NULL DEFAULT 'Student' CHECK (role IN ('Student', 'Faculty', 'DeptAdmin', 'SuperAdmin', 'Publisher')),
  department TEXT DEFAULT 'General',
  year TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Notices table (Refactored to avoid ENUM transaction issues)
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL CHECK (char_length(title) <= 200),
  content TEXT NOT NULL CHECK (char_length(content) <= 10000),
  summary TEXT,
  category TEXT NOT NULL DEFAULT 'General' CHECK (category IN ('Academic', 'Event', 'Administrative', 'General')),
  urgency TEXT NOT NULL DEFAULT 'Normal' CHECK (urgency IN ('Critical', 'Important', 'Normal', 'Info')),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  department TEXT DEFAULT 'General',
  links JSONB DEFAULT NULL,
  poll JSONB DEFAULT NULL,
  is_survey BOOLEAN DEFAULT FALSE,
  expiry_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_category ON notices(category);
CREATE INDEX IF NOT EXISTS idx_notices_urgency ON notices(urgency);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 5. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notices_updated_at ON notices;
CREATE TRIGGER update_notices_updated_at
  BEFORE UPDATE ON notices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'Student'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- ──── Users Policies ────
DROP POLICY IF EXISTS "Users are viewable by authenticated users" ON users;
CREATE POLICY "Users are viewable by authenticated users" ON users FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ──── Notices Policies ────
DROP POLICY IF EXISTS "Notices are viewable by authenticated users" ON notices;
CREATE POLICY "Notices are viewable by authenticated users" ON notices FOR SELECT TO authenticated USING (true);

-- Explicitly allow Publishers and SuperAdmins to post
DROP POLICY IF EXISTS "Authorized users can create notices" ON notices;
CREATE POLICY "Authorized users can create notices"
  ON notices FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('Publisher', 'SuperAdmin')
    )
  );

DROP POLICY IF EXISTS "Author or admins can update notices" ON notices;
CREATE POLICY "Author or admins can update notices"
  ON notices FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('Publisher', 'SuperAdmin'))
  );

DROP POLICY IF EXISTS "Author or admins can delete notices" ON notices;
CREATE POLICY "Author or admins can delete notices"
  ON notices FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('Publisher', 'SuperAdmin'))
  );

-- 8. Enable Realtime
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'notices'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notices;
  END IF;
END $$;
