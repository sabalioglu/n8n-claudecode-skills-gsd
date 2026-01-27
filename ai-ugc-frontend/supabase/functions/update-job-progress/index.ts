// Supabase Edge Function: update-job-progress
// Receives progress updates from n8n workflow and updates video_jobs table

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProgressUpdate {
  job_id: string
  current_step: string
  progress_percentage?: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message?: string
  result_video_url?: string
  character_model?: {
    image_url: string
  }
  product_analysis?: Record<string, unknown>
  scenes?: Array<{
    sceneNumber: number
    sceneType: string
    sceneImageUrl: string
    processingTime?: number
  }>
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const body: ProgressUpdate = await req.json()

    console.log('Received progress update:', JSON.stringify(body, null, 2))

    // Validate required fields
    if (!body.job_id) {
      return new Response(
        JSON.stringify({ error: 'job_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      status: body.status,
      current_step: body.current_step,
      updated_at: new Date().toISOString(),
    }

    // Add optional fields if present
    if (body.progress_percentage !== undefined) {
      updateData.progress_percentage = body.progress_percentage
    }

    if (body.error_message) {
      updateData.error_message = body.error_message
    }

    if (body.result_video_url) {
      updateData.result_video_url = body.result_video_url
      updateData.completed_at = new Date().toISOString()
    }

    if (body.character_model) {
      updateData.character_image_url = body.character_model.image_url
    }

    if (body.product_analysis) {
      updateData.product_analysis = body.product_analysis
    }

    if (body.scenes) {
      updateData.scenes = body.scenes
    }

    // Update video job in database
    const { data, error } = await supabase
      .from('video_jobs')
      .update(updateData)
      .eq('id', body.job_id)
      .select()
      .single()

    if (error) {
      console.error('Database update error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Job updated successfully:', data?.id)

    return new Response(
      JSON.stringify({
        success: true,
        job_id: body.job_id,
        status: body.status,
        message: 'Progress updated successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
