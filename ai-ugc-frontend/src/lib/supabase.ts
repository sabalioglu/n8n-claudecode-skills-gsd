import { createClient } from '@supabase/supabase-js';
import type { VideoJob, Profile, CreditTransaction } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yiwezubimkzkqxzbfodn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpd2V6dWJpbWt6a3F4emJmb2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NTc3MDgsImV4cCI6MjA4MzQzMzcwOH0.Eovc-Om11OEVJ5ZV8Txoc2VLSRsRundivdVtvDTKFu4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper function to get user profile with credits
export const getUserProfile = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
};

// Helper function to deduct credits
export const deductCredits = async (userId: string, amount: number, description: string, videoJobId?: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('deduct_credits', {
    p_user_id: userId,
    p_amount: amount,
    p_description: description,
    p_video_job_id: videoJobId || null,
  });

  if (error) throw error;
  return data as boolean;
};

// Helper function to add credits
export const addCredits = async (userId: string, amount: number, description: string, paymentId?: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('add_credits', {
    p_user_id: userId,
    p_amount: amount,
    p_description: description,
    p_payment_id: paymentId || null,
  });

  if (error) throw error;
  return data as boolean;
};

// Helper function to create video job
export const createVideoJob = async (
  userId: string,
  formData: {
    productName: string;
    productDescription: string;
    adType: string;
    targetAudience: string;
    platform: string;
    videoLength: string;
    productionMode: string;
    ugcStyleDetails: string;
    productImageUrl?: string;
  }
): Promise<VideoJob> => {
  const { data, error } = await supabase
    .from('video_jobs')
    .insert({
      user_id: userId,
      product_name: formData.productName,
      product_description: formData.productDescription,
      ad_type: formData.adType,
      target_audience: formData.targetAudience,
      platform: formData.platform,
      video_length: formData.videoLength,
      production_mode: formData.productionMode,
      ugc_style_details: formData.ugcStyleDetails,
      product_image_url: formData.productImageUrl,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data as VideoJob;
};

// Helper function to update video job status
export const updateVideoJobStatus = async (
  jobId: string,
  status: string,
  updates?: {
    n8nTaskId?: string;
    resultVideoUrl?: string;
    errorMessage?: string;
    completedAt?: string;
  }
): Promise<VideoJob> => {
  const { data, error } = await supabase
    .from('video_jobs')
    .update({
      status,
      n8n_task_id: updates?.n8nTaskId,
      result_video_url: updates?.resultVideoUrl,
      error_message: updates?.errorMessage,
      completed_at: updates?.completedAt,
    })
    .eq('id', jobId)
    .select()
    .single();

  if (error) throw error;
  return data as VideoJob;
};

// Helper function to get user's video jobs
export const getUserVideoJobs = async (userId: string, limit = 20): Promise<VideoJob[]> => {
  const { data, error } = await supabase
    .from('video_jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as VideoJob[];
};

// Helper function to get video job by ID
export const getVideoJob = async (jobId: string): Promise<VideoJob> => {
  const { data, error } = await supabase
    .from('video_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) throw error;
  return data as VideoJob;
};

// Helper function to get user's credit transactions
export const getUserTransactions = async (userId: string, limit = 50): Promise<CreditTransaction[]> => {
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as CreditTransaction[];
};

// Helper function to upload product image
export const uploadProductImage = async (userId: string, file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};
