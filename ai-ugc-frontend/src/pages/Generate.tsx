import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Button,
  Input,
  Select,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  FileUpload,
} from '../components/ui';
import {
  VIDEO_LENGTHS,
  AD_TYPES,
  TARGET_AUDIENCES,
  PLATFORMS,
  PRODUCTION_MODES,
  UGC_STYLES,
  getVideoLengthCredits,
  formatCredits,
} from '../lib/utils';
import { createVideoJob, uploadProductImage, deductCredits } from '../lib/supabase';
import { toast } from 'sonner';
import {
  Sparkles,
  Video,
  ArrowRight,
  AlertCircle,
  Info,
  Check,
  Loader2,
} from 'lucide-react';

interface FormData {
  productName: string;
  productDescription: string;
  adType: string;
  targetAudience: string;
  platform: string;
  videoLength: string;
  productionMode: string;
  ugcStyleDetails: string;
  additionalNotes: string;
  productImage: File | null;
}

interface FormErrors {
  productName?: string;
  productDescription?: string;
  adType?: string;
  targetAudience?: string;
  platform?: string;
  videoLength?: string;
  productionMode?: string;
  ugcStyleDetails?: string;
  productImage?: string;
}

export function Generate() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    productName: '',
    productDescription: '',
    adType: '',
    targetAudience: '',
    platform: '',
    videoLength: '',
    productionMode: '',
    ugcStyleDetails: '',
    additionalNotes: '',
    productImage: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const creditsRequired = getVideoLengthCredits(formData.videoLength);
  const hasEnoughCredits = (profile?.credits || 0) >= creditsRequired;

  const validateStep = (stepNum: number): boolean => {
    const newErrors: FormErrors = {};

    if (stepNum === 1) {
      if (!formData.productName.trim()) {
        newErrors.productName = 'Product name is required';
      }
      if (!formData.productDescription.trim()) {
        newErrors.productDescription = 'Product description is required';
      }
      if (!formData.productImage) {
        newErrors.productImage = 'Product image is required';
      }
    }

    if (stepNum === 2) {
      if (!formData.adType) {
        newErrors.adType = 'Ad type is required';
      }
      if (!formData.targetAudience) {
        newErrors.targetAudience = 'Target audience is required';
      }
      if (!formData.platform) {
        newErrors.platform = 'Platform is required';
      }
    }

    if (stepNum === 3) {
      if (!formData.videoLength) {
        newErrors.videoLength = 'Video length is required';
      }
      if (!formData.productionMode) {
        newErrors.productionMode = 'Production mode is required';
      }
      if (!formData.ugcStyleDetails) {
        newErrors.ugcStyleDetails = 'UGC style is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    if (!hasEnoughCredits) {
      toast.error(`You need ${creditsRequired} credits. You have ${profile?.credits || 0}.`);
      return;
    }

    setLoading(true);
    try {
      // Upload product image
      let productImageUrl = '';
      if (formData.productImage) {
        productImageUrl = await uploadProductImage(user!.id, formData.productImage);
      }

      // Create video job in Supabase
      const job = await createVideoJob(user!.id, {
        productName: formData.productName,
        productDescription: formData.productDescription,
        adType: formData.adType,
        targetAudience: formData.targetAudience,
        platform: formData.platform,
        videoLength: formData.videoLength,
        productionMode: formData.productionMode,
        ugcStyleDetails: formData.ugcStyleDetails,
        productImageUrl,
      });

      // Deduct credits
      await deductCredits(
        user!.id,
        creditsRequired,
        `Video generation: ${formData.productName}`,
        job.id
      );

      // Send to n8n webhook
      const webhookUrl = 'https://n8n.tsagroupllc.com/webhook/ugc-video-gen';

      const webhookFormData = new FormData();
      webhookFormData.append('Product Name', formData.productName);
      webhookFormData.append('Product Description', formData.productDescription);
      webhookFormData.append('Ad Type', formData.adType);
      webhookFormData.append('Target Audience', formData.targetAudience);
      webhookFormData.append('Platform', formData.platform);
      webhookFormData.append('Video Length (includes problem scene + solution scenes)', formData.videoLength);
      webhookFormData.append('Production Mode', formData.productionMode);
      webhookFormData.append('UGC Style Details', formData.ugcStyleDetails);
      webhookFormData.append('Additional Notes', formData.additionalNotes);
      webhookFormData.append('Email', user!.email || '');
      if (formData.productImage) {
        webhookFormData.append('data0', formData.productImage);
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: webhookFormData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit to n8n');
      }

      // Refresh profile to update credits
      await refreshProfile();

      toast.success('Video generation started!');
      navigate(`/progress/${job.id}`);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to start video generation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-indigo-300">AI-Powered Generation</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Create UGC Video</h1>
        <p className="text-[#94a3b8]">
          Fill in the details and let AI create your viral-ready video
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                s < step
                  ? 'bg-green-500 text-white'
                  : s === step
                  ? 'bg-indigo-500 text-white'
                  : 'bg-[#2d2d4a] text-[#64748b]'
              }`}
            >
              {s < step ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  s < step ? 'bg-green-500' : 'bg-[#2d2d4a]'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        {/* Step 1: Product Info */}
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Tell us about the product you want to advertise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Product Name"
                name="productName"
                placeholder="e.g., Goli Apple Cider Vinegar Gummies"
                value={formData.productName}
                onChange={handleChange}
                error={errors.productName}
              />

              <Textarea
                label="Product Description"
                name="productDescription"
                placeholder="Describe your product's key features and benefits..."
                rows={4}
                value={formData.productDescription}
                onChange={handleChange}
                error={errors.productDescription}
              />

              <FileUpload
                label="Product Image"
                onChange={(file) => {
                  setFormData((prev) => ({ ...prev, productImage: file }));
                  if (errors.productImage) {
                    setErrors((prev) => ({ ...prev, productImage: undefined }));
                  }
                }}
                error={errors.productImage}
                helperText="Upload a clear image of your product (PNG, JPG)"
              />

              <div className="flex justify-end">
                <Button onClick={handleNext}>
                  Next: Ad Settings
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: Ad Settings */}
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Ad Settings</CardTitle>
              <CardDescription>
                Configure your target audience and platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select
                label="Ad Type"
                name="adType"
                options={AD_TYPES}
                value={formData.adType}
                onChange={handleChange}
                error={errors.adType}
              />

              <Select
                label="Target Audience"
                name="targetAudience"
                options={TARGET_AUDIENCES}
                value={formData.targetAudience}
                onChange={handleChange}
                error={errors.targetAudience}
              />

              <Select
                label="Platform"
                name="platform"
                options={PLATFORMS}
                value={formData.platform}
                onChange={handleChange}
                error={errors.platform}
              />

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext}>
                  Next: Video Style
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 3: Video Style */}
        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Video Style & Length</CardTitle>
              <CardDescription>
                Choose your video format and style preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                  Video Length
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {VIDEO_LENGTHS.map((length) => (
                    <button
                      key={length.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          videoLength: length.value,
                        }))
                      }
                      className={`p-4 rounded-lg border text-left transition-all ${
                        formData.videoLength === length.value
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : 'border-[#2d2d4a] hover:border-[#3d3d5a] bg-[#1a1a2e]'
                      }`}
                    >
                      <div className="font-medium text-white">{length.label}</div>
                      <div className="text-sm text-[#64748b]">
                        {length.scenes} scenes · {length.credits} credits
                      </div>
                    </button>
                  ))}
                </div>
                {errors.videoLength && (
                  <p className="text-sm text-red-400 mt-2">{errors.videoLength}</p>
                )}
              </div>

              <Select
                label="Production Mode"
                name="productionMode"
                options={PRODUCTION_MODES}
                value={formData.productionMode}
                onChange={handleChange}
                error={errors.productionMode}
              />

              <Select
                label="UGC Style"
                name="ugcStyleDetails"
                options={UGC_STYLES}
                value={formData.ugcStyleDetails}
                onChange={handleChange}
                error={errors.ugcStyleDetails}
              />

              <Textarea
                label="Additional Notes (Optional)"
                name="additionalNotes"
                placeholder="Any specific instructions or preferences..."
                rows={3}
                value={formData.additionalNotes}
                onChange={handleChange}
              />

              {/* Credits Summary */}
              <div className="p-4 bg-[#0f0f23] rounded-lg border border-[#2d2d4a]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#94a3b8]">Credits Required</span>
                  <span className="text-xl font-bold text-white">
                    {creditsRequired}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94a3b8]">Your Balance</span>
                  <span
                    className={`font-medium ${
                      hasEnoughCredits ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {formatCredits(profile?.credits || 0)} credits
                  </span>
                </div>
                {!hasEnoughCredits && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Not enough credits.{' '}
                      <a href="/credits" className="underline">
                        Buy more
                      </a>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!hasEnoughCredits || loading}
                  loading={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 spinner" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Generate Video ({creditsRequired} credits)
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>

      {/* Tips */}
      <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-white mb-1">Pro Tips</h4>
            <ul className="text-sm text-[#94a3b8] space-y-1">
              <li>• Use high-quality product images for best results</li>
              <li>• Be specific in your product description</li>
              <li>• Match your target audience to your actual customers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
