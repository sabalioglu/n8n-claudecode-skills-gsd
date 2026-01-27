import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVideoJob } from '../lib/supabase';
import { formatDate } from '../lib/utils';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '../components/ui';
import {
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Target,
  Users,
  Film,
} from 'lucide-react';

export function Progress() {
  const { jobId } = useParams<{ jobId: string }>();

  const {
    data: job,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['videoJob', jobId],
    queryFn: () => getVideoJob(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      // Refetch every 5 seconds while processing
      const data = query.state.data;
      if (data?.status === 'processing' || data?.status === 'pending') {
        return 5000;
      }
      return false;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 spinner" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
        <p className="text-[#94a3b8] mb-6">
          We couldn't find the video generation job you're looking for.
        </p>
        <Link to="/dashboard">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const isProcessing = job.status === 'processing' || job.status === 'pending';
  const isCompleted = job.status === 'completed';
  const isFailed = job.status === 'failed';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center text-[#94a3b8] hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">{job.product_name}</h1>
          <p className="text-[#94a3b8]">
            Created {formatDate(job.created_at)}
          </p>
        </div>
        <Badge
          variant={
            isCompleted ? 'success' : isFailed ? 'error' : 'info'
          }
          className="text-sm px-4 py-1.5"
        >
          {isProcessing && <Loader2 className="w-4 h-4 mr-2 spinner" />}
          {isCompleted && <CheckCircle className="w-4 h-4 mr-2" />}
          {isFailed && <AlertCircle className="w-4 h-4 mr-2" />}
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player / Progress */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-[#0f0f23] rounded-lg overflow-hidden">
                {isCompleted && job.result_video_url ? (
                  <video
                    src={job.result_video_url}
                    controls
                    className="w-full h-full object-cover"
                    poster={job.product_image_url || undefined}
                  />
                ) : isProcessing ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8">
                    <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 pulse-glow">
                      <Sparkles className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Generating Your Video
                    </h3>
                    <p className="text-[#94a3b8] text-center mb-4 max-w-md">
                      Our AI is crafting your UGC video. This typically takes
                      10-15 minutes.
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#94a3b8]">Progress</span>
                        <span className="text-indigo-400 font-medium">
                          {job.progress_percentage || 0}%
                        </span>
                      </div>
                      <div className="h-3 bg-[#2d2d4a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${job.progress_percentage || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Current Step */}
                    {job.current_step && (
                      <div className="flex items-center gap-2 text-white bg-indigo-500/20 px-4 py-2 rounded-lg">
                        <Loader2 className="w-4 h-4 text-indigo-400 spinner" />
                        <span>{job.current_step}</span>
                      </div>
                    )}

                    {/* Character Image Preview */}
                    {job.character_image_url && (
                      <div className="mt-6">
                        <p className="text-sm text-[#64748b] mb-2 text-center">AI Character Generated</p>
                        <img
                          src={job.character_image_url}
                          alt="AI Character"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-indigo-500/30"
                        />
                      </div>
                    )}

                    {/* Generated Scenes Preview */}
                    {job.scenes && job.scenes.length > 0 && (
                      <div className="mt-6 w-full max-w-md">
                        <p className="text-sm text-[#64748b] mb-2">Generated Scenes</p>
                        <div className="grid grid-cols-4 gap-2">
                          {job.scenes.map((scene) => (
                            <div key={scene.sceneNumber} className="relative">
                              <img
                                src={scene.sceneImageUrl}
                                alt={`Scene ${scene.sceneNumber}`}
                                className="w-full h-16 object-cover rounded"
                              />
                              <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-center text-white py-0.5">
                                {scene.sceneNumber}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : isFailed ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8">
                    <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Generation Failed
                    </h3>
                    <p className="text-[#94a3b8] text-center mb-4 max-w-md">
                      {job.error_message ||
                        'An error occurred during video generation.'}
                    </p>
                    <Button variant="secondary" onClick={() => refetch()}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Clock className="w-16 h-16 text-[#64748b]" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {isCompleted && job.result_video_url && (
            <div className="flex flex-wrap gap-3">
              <a
                href={job.result_video_url}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Download Video
                </Button>
              </a>
              <Link to="/generate">
                <Button variant="secondary">
                  <Video className="w-4 h-4 mr-2" />
                  Create Another
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar - Job Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Video Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2d2d4a] rounded-lg">
                  <Film className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-[#64748b]">Video Length</p>
                  <p className="font-medium">{job.video_length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2d2d4a] rounded-lg">
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-[#64748b]">Platform</p>
                  <p className="font-medium">{job.platform}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2d2d4a] rounded-lg">
                  <Users className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-[#64748b]">Target Audience</p>
                  <p className="font-medium">{job.target_audience}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2d2d4a] rounded-lg">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-[#64748b]">UGC Style</p>
                  <p className="font-medium">{job.ugc_style_details}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              {job.product_image_url ? (
                <img
                  src={job.product_image_url}
                  alt={job.product_name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-[#2d2d4a] rounded-lg flex items-center justify-center">
                  <Video className="w-12 h-12 text-[#64748b]" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#94a3b8] text-sm leading-relaxed">
                {job.product_description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
