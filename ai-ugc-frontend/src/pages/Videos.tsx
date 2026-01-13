import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getUserVideoJobs } from '../lib/supabase';
import { formatRelativeTime, formatDate } from '../lib/utils';
import { Button, Card, Badge } from '../components/ui';
import {
  Video,
  Plus,
  Download,
  Play,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Filter,
  Search,
  Grid,
  List,
} from 'lucide-react';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'completed' | 'processing' | 'pending' | 'failed';

export function Videos() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: videos, isLoading } = useQuery({
    queryKey: ['videoJobs', user?.id, 'all'],
    queryFn: () => getUserVideoJobs(user!.id, 100),
    enabled: !!user,
  });

  const filteredVideos = videos?.filter((video) => {
    const matchesStatus =
      statusFilter === 'all' || video.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      video.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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

  const getStatusVariant = (
    status: string
  ): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Videos</h1>
          <p className="text-[#94a3b8]">
            {videos?.length || 0} total videos generated
          </p>
        </div>
        <Link to="/generate">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Video
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-[#1a1a2e] border border-[#2d2d4a] rounded-lg text-white placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#64748b]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-4 py-2.5 bg-[#1a1a2e] border border-[#2d2d4a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-[#1a1a2e] border border-[#2d2d4a] rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-indigo-500 text-white'
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-indigo-500 text-white'
                : 'text-[#64748b] hover:text-white'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-400 spinner" />
        </div>
      ) : filteredVideos && filteredVideos.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Link key={video.id} to={`/progress/${video.id}`}>
                <Card className="overflow-hidden hover:border-indigo-500/30 transition-colors group">
                  {/* Thumbnail */}
                  <div className="aspect-[9/16] max-h-64 bg-[#0f0f23] relative overflow-hidden">
                    {video.status === 'completed' && video.result_video_url ? (
                      <>
                        <video
                          src={video.result_video_url}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </>
                    ) : video.product_image_url ? (
                      <img
                        src={video.product_image_url}
                        alt={video.product_name}
                        className="w-full h-full object-cover opacity-50"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-12 h-12 text-[#64748b]" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={getStatusVariant(video.status)}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(video.status)}
                        {video.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-white truncate mb-1">
                      {video.product_name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-[#64748b]">
                      <span>{video.video_length}</span>
                      <span>{formatRelativeTime(video.created_at)}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredVideos.map((video) => (
              <Link key={video.id} to={`/progress/${video.id}`}>
                <Card className="hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-[#0f0f23] rounded-lg overflow-hidden flex-shrink-0">
                      {video.product_image_url ? (
                        <img
                          src={video.product_image_url}
                          alt={video.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-8 h-8 text-[#64748b]" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">
                        {video.product_name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-[#64748b] mt-1">
                        <span>{video.video_length}</span>
                        <span>·</span>
                        <span>{video.platform}</span>
                        <span>·</span>
                        <span>{video.target_audience}</span>
                      </div>
                      <p className="text-xs text-[#64748b] mt-1">
                        {formatDate(video.created_at)}
                      </p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={getStatusVariant(video.status)}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(video.status)}
                        {video.status}
                      </Badge>

                      {video.status === 'completed' && video.result_video_url && (
                        <a
                          href={video.result_video_url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-[#64748b] hover:text-white hover:bg-[#2d2d4a] rounded-lg transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto bg-[#2d2d4a] rounded-full flex items-center justify-center mb-4">
            <Video className="w-10 h-10 text-[#64748b]" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Videos Found</h3>
          <p className="text-[#94a3b8] mb-6 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters or search query'
              : "You haven't created any videos yet. Start by creating your first AI UGC video!"}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link to="/generate">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Video
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
