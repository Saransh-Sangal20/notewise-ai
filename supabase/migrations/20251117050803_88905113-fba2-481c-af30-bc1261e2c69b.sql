-- Add tags column to notes table
ALTER TABLE public.notes 
ADD COLUMN tags text[] DEFAULT '{}';

-- Add index for better performance when filtering by tags
CREATE INDEX idx_notes_tags ON public.notes USING GIN(tags);