-- Add completed_at column to tasks table for precise time-based analytics
ALTER TABLE tasks ADD COLUMN completed_at timestamp with time zone;

-- Optional: Update existing completed tasks to have a completed_at (using created_at as fallback to prevent nulls in charts, or leave null)
-- We will leave it null to avoid false historical data. New completions will be tracked accurately.
