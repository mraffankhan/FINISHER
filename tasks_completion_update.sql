-- Add completion_type column to tasks table
ALTER TABLE tasks ADD COLUMN completion_type text CHECK (completion_type IN ('full', 'partial'));
