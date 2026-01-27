-- Add progress tracking columns to video_jobs table
-- These columns are updated by the n8n workflow via the update-job-progress Edge Function

-- Add current_step column for tracking which step the job is at
ALTER TABLE public.video_jobs
ADD COLUMN IF NOT EXISTS current_step TEXT;

-- Add progress_percentage column for showing progress bar
ALTER TABLE public.video_jobs
ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Add character_image_url for storing the generated character image
ALTER TABLE public.video_jobs
ADD COLUMN IF NOT EXISTS character_image_url TEXT;

-- Add product_analysis JSONB for storing AI analysis results
ALTER TABLE public.video_jobs
ADD COLUMN IF NOT EXISTS product_analysis JSONB;

-- Add scenes JSONB array for storing generated scene data
ALTER TABLE public.video_jobs
ADD COLUMN IF NOT EXISTS scenes JSONB;

-- Add updated_at column if not exists
ALTER TABLE public.video_jobs
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_video_jobs_status_updated ON public.video_jobs(status, updated_at DESC);

-- Add RLS policy for service role to update jobs (for Edge Function)
-- The service role bypasses RLS, but we need to allow the Edge Function to update any job
CREATE POLICY IF NOT EXISTS "Service role can update any video job"
ON public.video_jobs FOR UPDATE
USING (true)
WITH CHECK (true);

-- Comment on new columns for documentation
COMMENT ON COLUMN public.video_jobs.current_step IS 'Current processing step description from n8n workflow';
COMMENT ON COLUMN public.video_jobs.progress_percentage IS 'Progress percentage (0-100) updated during video generation';
COMMENT ON COLUMN public.video_jobs.character_image_url IS 'URL of the generated AI character/avatar image';
COMMENT ON COLUMN public.video_jobs.product_analysis IS 'JSON object containing AI product analysis results';
COMMENT ON COLUMN public.video_jobs.scenes IS 'JSON array of generated scene data including images and metadata';
