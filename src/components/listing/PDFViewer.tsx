import { FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileName?: string;
  documentUrl?: string;
  documentType?: 'listing' | 'contract';
}

export function PDFViewer({ fileName, documentUrl, documentType = 'listing' }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Use actual PDF for contracts
  const pdfUrl = documentType === 'contract' 
    ? '/documents/contract-agreement.pdf'
    : documentUrl || null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  const openInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(false);
  }

  function onDocumentLoadError() {
    setLoading(false);
    setError(true);
  }

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));

  return (
    <div className="flex flex-col h-full bg-muted/30 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
            {fileName || 'Document.pdf'}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          {pdfUrl && (
            <>
              <div className="w-px h-4 bg-border mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={openInNewTab}
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 overflow-auto p-4 flex justify-center">
        {pdfUrl ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Loading PDF...</p>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Unable to load PDF preview.
                </p>
                <Button onClick={openInNewTab} variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open PDF in new tab
                </Button>
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              scale={zoom / 100}
              className="shadow-lg"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        ) : (
          /* Fallback mock content for listings without PDF */
          <div 
            className="bg-card border border-border rounded shadow-sm transition-transform p-8"
            style={{ 
              width: `${(8.5 * 72 * zoom) / 100}px`,
              minHeight: `${(11 * 72 * zoom) / 100}px`,
            }}
          >
            <div className="text-center border-b border-border pb-4">
              <h2 className="text-lg font-bold text-foreground">
                RESIDENTIAL LISTING AGREEMENT
              </h2>
              <p className="text-sm text-muted-foreground">
                Exclusive Right to Sell
              </p>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Document preview not available.</p>
              <p className="mt-2">Upload a PDF to view the actual document.</p>
            </div>
          </div>
        )}
      </div>

      {/* Page Navigation */}
      {pdfUrl && numPages > 0 && (
        <div className="flex items-center justify-center gap-4 p-2 border-t border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
