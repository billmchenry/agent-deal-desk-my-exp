import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentDropzoneProps {
  onFileSelect: (file: File) => void;
  onBatchSelect?: (files: File[]) => void;
  disabled?: boolean;
  documentType?: 'listing' | 'contract';
  allowMultiple?: boolean;
  compact?: boolean;
}

export function DocumentDropzone({ 
  onFileSelect, 
  onBatchSelect,
  disabled, 
  documentType = 'contract',
  allowMultiple = false,
  compact = false
}: DocumentDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const dropzoneText = 'Drop Documents';

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((files: FileList) => {
    const pdfFiles = Array.from(files).filter(f => f.type === 'application/pdf');
    
    if (pdfFiles.length === 0) return;

    if (pdfFiles.length === 1) {
      // Single file - use single file handler
      onFileSelect(pdfFiles[0]);
    } else if (allowMultiple && onBatchSelect) {
      // Multiple files - use batch handler
      onBatchSelect(pdfFiles);
    } else {
      // Multiple files but batch not enabled - just use first file
      onFileSelect(pdfFiles[0]);
    }
  }, [allowMultiple, onFileSelect, onBatchSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    processFiles(e.dataTransfer.files);
  }, [disabled, processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [processFiles]);

  if (compact) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative px-3 py-1.5 rounded-md border transition-all duration-200 cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/50 hover:bg-muted/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          type="file"
          accept=".pdf"
          multiple={allowMultiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Upload className="w-3.5 h-3.5" />
          <span>Browse</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative p-8 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer group',
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-border hover:border-primary/50 hover:bg-muted/30',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input
        type="file"
        accept=".pdf"
        multiple={allowMultiple}
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
          isDragging ? 'bg-primary/20' : 'bg-muted group-hover:bg-primary/10'
        )}>
          <Upload className={cn(
            'w-6 h-6 transition-colors',
            isDragging ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
          )} />
        </div>
        
        <div>
          <p className="font-medium text-foreground">
            {dropzoneText}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {allowMultiple 
              ? 'Drop multiple PDFs or click to browse'
              : 'or click to browse • PDF files only'}
          </p>
        </div>
      </div>
    </div>
  );
}
