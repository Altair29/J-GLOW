-- Activity Logs テーブル
CREATE TABLE IF NOT EXISTS activity_logs (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   timestamptz DEFAULT now(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id   text NOT NULL,
  user_type    text NOT NULL DEFAULT 'guest'
               CHECK (user_type IN ('member', 'guest')),
  event_type   text NOT NULL
               CHECK (event_type IN (
                 'page_view',
                 'tool_use',
                 'tool_complete',
                 'click',
                 'form_submit',
                 'article_read'
               )),
  event_name   text NOT NULL,
  page_path    text,
  metadata     jsonb DEFAULT '{}',
  device_type  text CHECK (device_type IN ('mobile', 'desktop', 'tablet')),
  referrer     text
);

CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_event_name ON activity_logs(event_name);
CREATE INDEX idx_activity_logs_user_id    ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_session_id ON activity_logs(session_id);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can insert logs"
  ON activity_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "service role can read all logs"
  ON activity_logs FOR SELECT
  TO service_role
  USING (true);
