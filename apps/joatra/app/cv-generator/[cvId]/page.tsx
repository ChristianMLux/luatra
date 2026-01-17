"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@repo/core";
import { cvClientService } from "@/lib/services/cvClientService";
import { getUserProfile } from "@/lib/services/profileService";
import { GeneratedCV, UserProfile, Job } from "@/lib/types";
import { getJobs } from "@/lib/services/jobService";
import CVPreview from "@/components/cv/CVPreview";
import CVEditor from "@/components/cv/CVEditor";
import { Skeleton } from "@repo/ui";

export default function CVDetailPage() {
  const { cvId } = useParams();
  const { user } = useAuth();
  
  const [cv, setCv] = useState<GeneratedCV | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [job, setJob] = useState<Job | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"view" | "edit">("view");

  useEffect(() => {
    async function load() {
       if (!user || !cvId) return;
       try {
          const fetchedCV = await cvClientService.getGeneratedCV(cvId as string);
          if (fetchedCV) {
             setCv(fetchedCV);
             
             // Fetch related data
             const [fetchedProfile, fetchedJobs] = await Promise.all([
                getUserProfile(user.uid),
                getJobs(user.uid)
             ]);
             
             if (fetchedProfile) setProfile(fetchedProfile);
             if (fetchedCV.jobId) {
                const foundJob = fetchedJobs.find(j => j.id === fetchedCV.jobId);
                setJob(foundJob);
             }
          }
       } catch (e) {
          console.error(e);
       } finally {
          setLoading(false);
       }
    }
    load();
  }, [user, cvId]);

  const handleUpdateContent = async (newContent: any) => {
     if (!cv) return;
     // Update local state instantly for preview
     setCv({ ...cv, content: newContent });
     
     // Debounce save (simple version: just save instantly for now or rely on explicit save button?) 
     // For this basic port, I'll autosave on change (maybe debounced in real app). 
     // I'll add a manual "Save" button in Editor if needed, but Editor passes change up. 
     // Let's autosave with fire-and-forget for now
     await cvClientService.updateGeneratedCV(cv.id!, { content: newContent });
  };

  if (loading || !cv || !profile) {
     return <Skeleton className="h-screen w-full" />;
  }

  return (
    <div className="h-[calc(100vh-64px)] p-4 flex gap-4 overflow-hidden">
       {/* Editor Panel (Conditional or Side-by-Side) */}
       {mode === "edit" && (
          <div className="w-1/2 h-full overflow-hidden flex flex-col">
             <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold">Editor</h2>
                <button onClick={() => setMode("view")} className="text-sm underline">Close Editor</button>
             </div>
             <CVEditor content={cv.content} onChange={handleUpdateContent} />
          </div>
       )}

       {/* Preview Panel */}
       <div className={`${mode === "edit" ? "w-1/2" : "w-full"} h-full transition-all duration-300`}>
          <CVPreview 
             profile={profile} 
             job={job} 
             content={cv.content} 
             templateId={cv.templateId}
             onEdit={() => setMode("edit")}
          />
       </div>
    </div>
  );
}
