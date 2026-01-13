-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    credits INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Credit transactions table
CREATE TABLE public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'bonus')),
    description TEXT NOT NULL,
    payment_id TEXT,
    video_job_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Video jobs table
CREATE TABLE public.video_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_description TEXT NOT NULL,
    ad_type TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    platform TEXT NOT NULL,
    video_length TEXT NOT NULL,
    production_mode TEXT NOT NULL,
    ugc_style_details TEXT NOT NULL,
    product_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    n8n_task_id TEXT,
    result_video_url TEXT,
    error_message TEXT,
    credits_used INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Pricing tiers table
CREATE TABLE public.pricing_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    price_usd DECIMAL(10, 2) NOT NULL,
    stripe_price_id TEXT,
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key constraint for credit_transactions -> video_jobs
ALTER TABLE public.credit_transactions
ADD CONSTRAINT fk_credit_transactions_video_job
FOREIGN KEY (video_job_id) REFERENCES public.video_jobs(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);
CREATE INDEX idx_video_jobs_user_id ON public.video_jobs(user_id);
CREATE INDEX idx_video_jobs_status ON public.video_jobs(status);
CREATE INDEX idx_video_jobs_created_at ON public.video_jobs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- RLS Policies for credit_transactions
CREATE POLICY "Users can view their own transactions"
ON public.credit_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.credit_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for video_jobs
CREATE POLICY "Users can view their own video jobs"
ON public.video_jobs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video jobs"
ON public.video_jobs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video jobs"
ON public.video_jobs FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for pricing_tiers (public read)
CREATE POLICY "Anyone can view pricing tiers"
ON public.pricing_tiers FOR SELECT
USING (true);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, credits)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        10  -- Give new users 10 free credits
    );

    -- Record the bonus credits
    INSERT INTO public.credit_transactions (user_id, amount, type, description)
    VALUES (NEW.id, 10, 'bonus', 'Welcome bonus - 10 free credits');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to deduct credits
CREATE OR REPLACE FUNCTION public.deduct_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_description TEXT,
    p_video_job_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_credits INTEGER;
BEGIN
    -- Get current credits
    SELECT credits INTO v_current_credits
    FROM public.profiles
    WHERE id = p_user_id
    FOR UPDATE;

    -- Check if user has enough credits
    IF v_current_credits < p_amount THEN
        RETURN FALSE;
    END IF;

    -- Deduct credits
    UPDATE public.profiles
    SET credits = credits - p_amount,
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Record transaction
    INSERT INTO public.credit_transactions (user_id, amount, type, description, video_job_id)
    VALUES (p_user_id, -p_amount, 'usage', p_description, p_video_job_id);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits
CREATE OR REPLACE FUNCTION public.add_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_description TEXT,
    p_payment_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Add credits
    UPDATE public.profiles
    SET credits = credits + p_amount,
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Record transaction
    INSERT INTO public.credit_transactions (user_id, amount, type, description, payment_id)
    VALUES (p_user_id, p_amount, 'purchase', p_description, p_payment_id);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update profile timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Insert default pricing tiers
INSERT INTO public.pricing_tiers (name, credits, price_usd, is_popular) VALUES
('Starter', 25, 9.99, FALSE),
('Creator', 75, 24.99, TRUE),
('Pro', 200, 49.99, FALSE),
('Business', 500, 99.99, FALSE);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
CREATE POLICY "Users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Users can view all product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Users can update their own product images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own product images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
