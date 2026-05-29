import { useState, useCallback } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentDropzoneProps {
  onFileSelect: (file: File) => void;
  onBatchSelect?: (files: File[]) => void;
  disabled?: boolean;
  allowMultiple?: boolean;
  label?: string;
}

export function DocumentDropzone({
  onFileSelect,
  onBatchSelect,
  disabled,
  allowMultiple = false,
  label = "Drop Documents",
}: DocumentDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const pdfFiles = Array.from(files).filter((f) => f.type === "application/pdf");
      if (pdfFiles.length === 0) return;
      if (pdfFiles.length === 1 || !allowMultiple || !onBatchSelect) {
        onFileSelect(pdfFiles[0]);
      } else {
        onBatchSelect(pdfFiles);
      }
    },
    [allowMultiple, onFileSelect, onBatchSelect],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        processFiles(e.dataTransfer.files);
      }}
      className={cn(
        "relative p-8 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer group",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <input
        type="file"
        accept=".pdf"
        multiple={allowMultiple}
        onChange={(e) => {
          if (e.target.files) processFiles(e.target.files);
          e.target.value = "";
        }}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Upload document"
      />

      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isDragging ? "bg-primary/20" : "bg-primary/10 group-hover:bg-primary/15",
          )}
        >
          <UploadCloud
            className={cn(
              "w-6 h-6 transition-colors",
              isDragging ? "text-primary" : "text-primary",
            )}
          />
        </div>
        <div>
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {allowMultiple
              ? "Drop multiple PDFs or click to browse"
              : "or click to browse • PDF files only"}
          </p>
        </div>
      </div>
    </div>
  );
}
