export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: 'purchase' | 'usage' | 'refund' | 'bonus';
          description: string;
          payment_id: string | null;
          video_job_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: 'purchase' | 'usage' | 'refund' | 'bonus';
          description: string;
          payment_id?: string | null;
          video_job_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: 'purchase' | 'usage' | 'refund' | 'bonus';
          description?: string;
          payment_id?: string | null;
          video_job_id?: string | null;
          created_at?: string;
        };
      };
      video_jobs: {
        Row: {
          id: string;
          user_id: string;
          product_name: string;
          product_description: string;
          ad_type: string;
          target_audience: string;
          platform: string;
          video_length: string;
          production_mode: string;
          ugc_style_details: string;
          product_image_url: string | null;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          n8n_task_id: string | null;
          result_video_url: string | null;
          error_message: string | null;
          credits_used: number;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_name: string;
          product_description: string;
          ad_type: string;
          target_audience: string;
          platform: string;
          video_length: string;
          production_mode: string;
          ugc_style_details: string;
          product_image_url?: string | null;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          n8n_task_id?: string | null;
          result_video_url?: string | null;
          error_message?: string | null;
          credits_used?: number;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_name?: string;
          product_description?: string;
          ad_type?: string;
          target_audience?: string;
          platform?: string;
          video_length?: string;
          production_mode?: string;
          ugc_style_details?: string;
          product_image_url?: string | null;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          n8n_task_id?: string | null;
          result_video_url?: string | null;
          error_message?: string | null;
          credits_used?: number;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      pricing_tiers: {
        Row: {
          id: string;
          name: string;
          credits: number;
          price_usd: number;
          stripe_price_id: string | null;
          is_popular: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          credits: number;
          price_usd: number;
          stripe_price_id?: string | null;
          is_popular?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          credits?: number;
          price_usd?: number;
          stripe_price_id?: string | null;
          is_popular?: boolean;
          created_at?: string;
        };
      };
    };
    Functions: {
      deduct_credits: {
        Args: {
          p_user_id: string;
          p_amount: number;
          p_description: string;
          p_video_job_id: string | null;
        };
        Returns: boolean;
      };
      add_credits: {
        Args: {
          p_user_id: string;
          p_amount: number;
          p_description: string;
          p_payment_id: string | null;
        };
        Returns: boolean;
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type CreditTransaction = Database['public']['Tables']['credit_transactions']['Row'];
export type VideoJob = Database['public']['Tables']['video_jobs']['Row'];
export type PricingTier = Database['public']['Tables']['pricing_tiers']['Row'];
