"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@repo/core";
import { useJobs } from "@/lib/hooks/useJobs";
import { getUserProfile } from "@/lib/services/profileService";
import { generateCoverLetterAction } from "@/app/actions/coverLetterActions";
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { toast } from "@repo/ui";
import { Loader2, Sparkles, Copy } from "lucide-react";
import { UserProfile } from "@/lib/types";

export default function CoverLetterPage() {
  const { user } = useAuth();
  const { jobs } = useJobs();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [generatedLetter, setGeneratedLetter] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(setProfile);
    }
  }, [user]);

  const handleGenerate = async () => {
    if (!selectedJobId || !profile) {
       toast.error("Please select a job and ensure your profile is complete.");
       return;
    }
    
    const job = jobs.find(j => j.id === selectedJobId);
    if (!job) return;

    setGenerating(true);
    try {
       // Sanitize payload to ensure plain objects (removing Firebase Timestamp methods)
       const payload = JSON.parse(JSON.stringify({
          profileData: profile,
          jobData: job,
          templateData: {
             language: 'en' as const,
             style: 'formal' as const
          }
       }));

       const result = await generateCoverLetterAction(payload);
       
       if (result.success && result.content) {
          const c = result.content;
          const letterText = [
             c.personalDetailsBlock,
             c.companyAddressBlock,
             c.date,
             c.subject,
             c.salutation,
             c.introduction,
             c.mainBody,
             c.closing
          ].filter(Boolean).join('\n\n');
          setGeneratedLetter(letterText);
          toast.success("Cover Letter Generated!");
       } else {
          toast.error(result.error || "Failed to generate.");
       }
    } catch (e) {
       toast.error("An error occurred.");
    } finally {
       setGenerating(false);
    }
  };

  const copyToClipboard = () => {
     navigator.clipboard.writeText(generatedLetter);
     toast.success("Copied to clipboard!");
  };

  if (!user) return <div className="p-8">Please log in.</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold mb-6">Cover Letter Generator</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
         {/* Controls */}
         <Card>
            <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Select Job Application</label>
                  <select 
                     className="w-full p-2 rounded-md border bg-background"
                     value={selectedJobId}
                     onChange={(e) => setSelectedJobId(e.target.value)}
                  >
                     <option value="">-- Select a Job --</option>
                     {jobs.map(j => (
                        <option key={j.id} value={j.id}>{j.company} - {j.jobTitle}</option>
                     ))}
                  </select>
               </div>
               
               <Button 
                  onClick={handleGenerate} 
                  disabled={generating || !selectedJobId} 
                  className="w-full"
               >
                  {generating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                  Generate Letter
               </Button>
            </CardContent>
         </Card>

         {/* Output */}
         <Card className="h-full min-h-[500px]">
            <CardHeader className="flex flex-row justify-between items-center">
               <CardTitle>Result</CardTitle>
               {generatedLetter && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                     <Copy className="h-4 w-4" />
                  </Button>
               )}
            </CardHeader>
            <CardContent>
               {generating ? (
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-[90%]" />
                     <Skeleton className="h-4 w-[95%]" />
                     <Skeleton className="h-4 w-[80%]" />
                  </div>
               ) : generatedLetter ? (
                  <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed p-4 bg-white/5 rounded-md border border-white/10">
                     {generatedLetter}
                  </div>
               ) : (
                  <div className="text-muted-foreground text-center py-20">
                     Select a job and click generate to create a tailored cover letter.
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
