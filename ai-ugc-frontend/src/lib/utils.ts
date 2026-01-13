import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCredits(credits: number): string {
  return new Intl.NumberFormat('en-US').format(credits);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getVideoLengthCredits(videoLength: string): number {
  const creditMap: Record<string, number> = {
    '12s Minimal': 5,
    '16s Problem + Solution': 8,
    '24s Problem + Discovery + Success': 12,
    '32s (Problem + Discovery + Trial + Success)': 16,
    '40s (5 scenes total)': 20,
    '48s (6 scenes total)': 24,
    '56s (7 scenes total)': 28,
    '60s (8 scenes total)': 30,
  };
  return creditMap[videoLength] || 10;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colorMap[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const VIDEO_LENGTHS = [
  { value: '12s Minimal', label: '12s Minimal', credits: 5, scenes: 2 },
  { value: '16s Problem + Solution', label: '16s Problem + Solution', credits: 8, scenes: 2 },
  { value: '24s Problem + Discovery + Success', label: '24s Problem + Discovery + Success', credits: 12, scenes: 3 },
  { value: '32s (Problem + Discovery + Trial + Success)', label: '32s (4 scenes)', credits: 16, scenes: 4 },
  { value: '40s (5 scenes total)', label: '40s (5 scenes)', credits: 20, scenes: 5 },
  { value: '48s (6 scenes total)', label: '48s (6 scenes)', credits: 24, scenes: 6 },
  { value: '56s (7 scenes total)', label: '56s (7 scenes)', credits: 28, scenes: 7 },
  { value: '60s (8 scenes total)', label: '60s (8 scenes)', credits: 30, scenes: 8 },
];

export const AD_TYPES = [
  { value: 'UGC - Talking Person with Product', label: 'UGC - Talking Person with Product' },
  { value: 'UGC - Product Demo', label: 'UGC - Product Demo' },
  { value: 'UGC - Testimonial', label: 'UGC - Testimonial' },
  { value: 'VFX - Product Showcase', label: 'VFX - Product Showcase' },
];

export const TARGET_AUDIENCES = [
  { value: 'Gen Z (18-24)', label: 'Gen Z (18-24)' },
  { value: 'Millennials (25-40)', label: 'Millennials (25-40)' },
  { value: 'Gen X (41-56)', label: 'Gen X (41-56)' },
  { value: 'Baby Boomers (57-75)', label: 'Baby Boomers (57-75)' },
  { value: 'Parents', label: 'Parents' },
  { value: 'Fitness Enthusiasts', label: 'Fitness Enthusiasts' },
  { value: 'Tech Enthusiasts', label: 'Tech Enthusiasts' },
  { value: 'Beauty & Skincare', label: 'Beauty & Skincare' },
];

export const PLATFORMS = [
  { value: 'TikTok/Reels (9:16)', label: 'TikTok/Reels (9:16)', aspectRatio: '9:16' },
  { value: 'YouTube/Facebook (16:9)', label: 'YouTube/Facebook (16:9)', aspectRatio: '16:9' },
  { value: 'Instagram Square (1:1)', label: 'Instagram Square (1:1)', aspectRatio: '1:1' },
  { value: 'Stories (9:16)', label: 'Stories (9:16)', aspectRatio: '9:16' },
];

export const PRODUCTION_MODES = [
  { value: 'Story Mode - Connected Scenes (Best for 16-32s UGC Vids)', label: 'Story Mode - Connected Scenes' },
  { value: 'Quick Mode - Single Scene', label: 'Quick Mode - Single Scene' },
  { value: 'Advanced Mode - Custom Scenes', label: 'Advanced Mode - Custom Scenes' },
];

export const UGC_STYLES = [
  { value: 'Before & After - Transformation', label: 'Before & After - Transformation' },
  { value: 'Day in the Life', label: 'Day in the Life' },
  { value: 'Unboxing & First Impressions', label: 'Unboxing & First Impressions' },
  { value: 'Tutorial & How-To', label: 'Tutorial & How-To' },
  { value: 'Review & Recommendation', label: 'Review & Recommendation' },
  { value: 'Challenge & Trend', label: 'Challenge & Trend' },
];
