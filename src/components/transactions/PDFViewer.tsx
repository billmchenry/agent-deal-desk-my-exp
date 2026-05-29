import { useMemo, useState } from "react";
import { FileText, ZoomIn, ZoomOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  fileName?: string;
  file?: File | null;
  documentUrl?: string;
}

/**
 * Lightweight PDF preview. Renders the uploaded file in an <iframe> when available,
 * otherwise shows a styled placeholder. Avoids adding react-pdf/pdfjs-dist deps.
 */
export function PDFViewer({ fileName, file, documentUrl }: Props) {
  const [zoom, setZoom] = useState(100);

  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const src = objectUrl || documentUrl || null;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));

  return (
    <div className="flex flex-col h-full bg-muted/30 rounded-2xl overflow-hidden border border-border/60">
      <div className="flex items-center justify-between p-2 border-b border-border bg-card">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">
            {fileName || file?.name || "Document.pdf"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center tabular-nums">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          {src && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => window.open(src, "_blank", "noopener,noreferrer")}
              aria-label="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex justify-center bg-muted/20">
        {src ? (
          <iframe
            src={src}
            title={fileName || "Document preview"}
            className="bg-card shadow-lg border border-border/40 rounded"
            style={{
              width: `${(8.5 * 96 * zoom) / 100}px`,
              height: `${(11 * 96 * zoom) / 100}px`,
            }}
          />
        ) : (
          <div
            className="bg-card border border-border rounded shadow-sm p-8"
            style={{
              width: `${(8.5 * 72 * zoom) / 100}px`,
              minHeight: `${(11 * 72 * zoom) / 100}px`,
            }}
          >
            <div className="text-center border-b border-border pb-4">
              <h2 className="text-lg font-bold text-foreground">DOCUMENT PREVIEW</h2>
              <p className="text-sm text-muted-foreground mt-1">Source PDF not available</p>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Upload a PDF to view the actual document here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
