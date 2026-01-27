import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getUserVideoJobs, getUserTransactions } from '../lib/supabase';
import { formatCredits, formatRelativeTime } from '../lib/utils';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '../components/ui';
import {
  Video,
  CreditCard,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Sparkles,
  Play,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';

export function Dashboard() {
  const { user, profile } = useAuth();

  const { data: videoJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['videoJobs', user?.id],
    queryFn: () => getUserVideoJobs(user!.id, 5),
    enabled: !!user,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => getUserTransactions(user!.id, 5),
    enabled: !!user,
  });

  const stats = {
    credits: profile?.credits || 0,
    totalVideos: videoJobs?.length || 0,
    completedVideos: videoJobs?.filter((j) => j.status === 'completed').length || 0,
    processingVideos: videoJobs?.filter((j) => j.status === 'processing').length || 0,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 spinner" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Creator'}
          </h1>
          <p className="text-[#94a3b8]">
            Here's an overview of your AI UGC activity
          </p>
        </div>
        <Link to="/generate">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Video
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <CreditCard className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-[#64748b] text-sm">Available Credits</p>
              <p className="text-2xl font-bold">{formatCredits(stats.credits)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Video className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-[#64748b] text-sm">Total Videos</p>
              <p className="text-2xl font-bold">{stats.totalVideos}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-[#64748b] text-sm">Completed</p>
              <p className="text-2xl font-bold">{stats.completedVideos}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Loader2 className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-[#64748b] text-sm">Processing</p>
              <p className="text-2xl font-bold">{stats.processingVideos}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Videos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-400" />
                Recent Videos
              </CardTitle>
              <Link
                to="/videos"
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-400 spinner" />
                </div>
              ) : videoJobs && videoJobs.length > 0 ? (
                <div className="space-y-4">
                  {videoJobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/progress/${job.id}`}
                      className="flex items-center gap-4 p-4 bg-[#0f0f23] rounded-lg hover:bg-[#1a1a2e] transition-colors"
                    >
                      <div className="w-16 h-16 bg-[#2d2d4a] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {job.product_image_url ? (
                          <img
                            src={job.product_image_url}
                            alt={job.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Video className="w-6 h-6 text-[#64748b]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">
                          {job.product_name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-[#64748b]">
                          <span>{job.video_length}</span>
                          <span>·</span>
                          <span>{job.platform}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            job.status === 'completed'
                              ? 'success'
                              : job.status === 'processing'
                              ? 'info'
                              : job.status === 'failed'
                              ? 'error'
                              : 'warning'
                          }
                          className="flex items-center gap-1"
                        >
                          {getStatusIcon(job.status)}
                          {job.status}
                        </Badge>
                        <span className="text-xs text-[#64748b]">
                          {formatRelativeTime(job.created_at)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-[#2d2d4a] rounded-full flex items-center justify-center mb-4">
                    <Video className="w-8 h-8 text-[#64748b]" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No videos yet</h3>
                  <p className="text-[#64748b] mb-4">
                    Create your first AI UGC video
                  </p>
                  <Link to="/generate">
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Video
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/generate" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Video
                </Button>
              </Link>
              <Link to="/credits" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Buy More Credits
                </Button>
              </Link>
              <Link to="/videos" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Play className="w-4 h-4 mr-2" />
                  View All Videos
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-indigo-400 spinner" />
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-2 border-b border-[#2d2d4a] last:border-0"
                    >
                      <div>
                        <p className="text-sm text-white">{tx.description}</p>
                        <p className="text-xs text-[#64748b]">
                          {formatRelativeTime(tx.created_at)}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          tx.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {tx.amount > 0 ? '+' : ''}
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#64748b] py-4">
                  No recent activity
                </p>
              )}
            </CardContent>
          </Card>

          {/* Credits Promotion */}
          {stats.credits < 20 && (
            <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/30">
              <CardContent>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center mb-3">
                    <CreditCard className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="font-medium mb-1">Running Low on Credits</h3>
                  <p className="text-sm text-[#94a3b8] mb-4">
                    You have {stats.credits} credits left. Top up to keep
                    creating!
                  </p>
                  <Link to="/credits">
                    <Button size="sm" className="w-full">
                      Buy Credits
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
