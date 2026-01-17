"use client";

import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { Document as PdfDisplayDoc, Page as PdfDisplayPage, pdfjs } from "react-pdf";
import { Button } from "@repo/ui";
import { UserProfile, Job, CVTemplate } from "@/lib/types";
import CVPdfDocument from "./CVPdfDocument";
import { Download, Loader2 } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CVPreviewProps {
  profile: UserProfile;
  job?: Job;
  content: any;
  templateId?: string;
  onEdit: () => void;
}

export default function CVPreview({ profile, job, content, templateId, onEdit }: CVPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number | null>(null);

  // Mock template for now
  const template: CVTemplate = {
      id: "standard",
      name: "Standard",
      description: "Default",
      language: "en",
      type: "standard",
      atsOptimized: true,
      photoIncluded: false
  };

  useEffect(() => {
    let url: string | null = null;
    
    const generate = async () => {
      setLoading(true);
      try {
        const blob = await pdf(
          <CVPdfDocument profile={profile} job={job} content={content} template={template} />
        ).toBlob();
        url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("PDF Gen Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (profile && content) {
       generate();
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [profile, job, content, templateId]); // Re-generate when content changes

  const handleDownload = () => {
    if (pdfUrl) {
       const link = document.createElement("a");
       link.href = pdfUrl;
       link.download = `CV_${profile.personalDetails.lastName}.pdf`;
       link.click();
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted/20 rounded-lg border">
       <div className="p-4 border-b flex justify-between items-center bg-background rounded-t-lg">
          <h2 className="font-semibold">Preview</h2>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={onEdit}>Edit Content</Button>
             <Button size="sm" onClick={handleDownload} disabled={!pdfUrl || loading}>
                <Download className="w-4 h-4 mr-2" /> Download PDF
             </Button>
          </div>
       </div>
       
       <div className="flex-1 overflow-auto flex justify-center p-4">
          {loading && <div className="flex items-center"><Loader2 className="animate-spin mr-2" /> Generating Preview...</div>}
          
          {!loading && pdfUrl && (
             <PdfDisplayDoc 
                file={pdfUrl} 
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<Loader2 className="animate-spin" />}
                className="shadow-lg"
             >
                <PdfDisplayPage pageNumber={1} width={600} renderTextLayer={false} renderAnnotationLayer={false} />
             </PdfDisplayDoc>
          )}
       </div>
    </div>
  );
}
