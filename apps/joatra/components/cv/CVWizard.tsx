"use client";

import { useState, useEffect } from "react";
import { useJobs } from "@/lib/hooks/useJobs";
import { useAuth } from "@repo/core";
import { getUserProfile } from "@/lib/services/profileService";
import { cvClientService } from "@/lib/services/cvClientService";
import { generateCVContentAction } from "@/app/actions/cvActions";
import { Button } from "@repo/ui";
import { Card, CardContent } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import { Job, UserProfile, GeneratedCV } from "@/lib/types";
import { toast } from "@repo/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function CVWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedJobId = searchParams.get("jobId");
  
  const { user } = useAuth();
  const { jobs, loading: jobsLoading } = useJobs();
  const [activeStep, setActiveStep] = useState(0); // 0: Select Job, 1: Generating -> Preview
  const [selectedJobId, setSelectedJobId] = useState<string | null>(preSelectedJobId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Load Profile on mount
  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(setProfile);
    }
  }, [user]);

  const handleGenerate = async () => {
    if (!selectedJobId || !user || !profile) return;
    
    const job = jobs.find(j => j.id === selectedJobId);
    if (!job) return;

    setIsGenerating(true);
    try {
      const { success, content, error } = await generateCVContentAction(profile, job);
      
      if (!success || !content) {
        throw new Error(error || "Generation failed");
      }

      // Save to Firestore
      const docRef = await cvClientService.createGeneratedCV(user.uid, {
        profileId: profile.id!,
        jobId: job.id!,
        templateId: "standard", // Default for now
        content,
        status: "completed"
      });

      toast.success("CV Generated Successfully!");
      router.push(`/cv-generator/${docRef.id}`); // Redirect to Editor/Preview
      
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate CV. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Show login prompt for unauthenticated users
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">CV Generator</h1>
        <p className="text-muted-foreground">Please log in via the Hub to generate CVs.</p>
      </div>
    );
  }

  if (jobsLoading || !profile) {
     return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">CV Generator</h1>
      
      {activeStep === 0 && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">Step 1: Select a Job</h2>
            <div className="grid gap-4">
              {jobs.map(job => (
                <div 
                  key={job.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedJobId === job.id ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}
                  onClick={() => setSelectedJobId(job.id!)}
                >
                  <div className="font-semibold">{job.jobTitle}</div>
                  <div className="text-sm text-muted-foreground">{job.company}</div>
                </div>
              ))}
              {jobs.length === 0 && <p className="text-muted-foreground">No jobs found. Please add a job first.</p>}
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleGenerate} 
                disabled={!selectedJobId || isGenerating}
                size="lg"
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isGenerating ? "Generating..." : "Generate CV"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
