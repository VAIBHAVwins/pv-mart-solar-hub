CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_id TEXT NOT NULL,
  to_id TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to insert/select their own messages
CREATE POLICY "Allow insert for authenticated" ON messages
  FOR INSERT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow select for authenticated" ON messages
  FOR SELECT USING (auth.role() = 'authenticated'); 