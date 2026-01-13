import { useCallback, useState } from 'react';
import { cn } from '../../lib/utils';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  error?: string;
  helperText?: string;
  onChange: (file: File | null) => void;
  preview?: string | null;
  className?: string;
}

export function FileUpload({
  label,
  accept = 'image/*',
  error,
  helperText,
  onChange,
  preview,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        onChange(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    [onChange]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onChange(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    [onChange]
  );

  const handleRemove = useCallback(() => {
    onChange(null);
    setPreviewUrl(null);
  }, [onChange]);

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-medium text-[#94a3b8]">
          {label}
        </label>
      )}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl transition-all duration-200',
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : error
            ? 'border-red-500 bg-red-500/5'
            : 'border-[#2d2d4a] hover:border-[#3d3d5a] hover:bg-[#1a1a2e]',
          previewUrl ? 'p-2' : 'p-8'
        )}
      >
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center cursor-pointer">
            <div className="p-3 bg-[#2d2d4a] rounded-xl mb-3">
              <Upload className="w-6 h-6 text-[#94a3b8]" />
            </div>
            <span className="text-white font-medium">
              Drop your image here, or{' '}
              <span className="text-indigo-400">browse</span>
            </span>
            <span className="text-sm text-[#64748b] mt-1">
              PNG, JPG up to 10MB
            </span>
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-[#64748b]">{helperText}</p>
      )}
    </div>
  );
}
