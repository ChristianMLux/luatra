"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@repo/core";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateJobWithLog, deleteJob } from "@/lib/services/jobService";
import { Job } from "@/lib/types";
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton, Input, Label, Textarea } from "@repo/ui";
import { toast } from "@repo/ui";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const jobId = params?.id as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    location: "",
    description: "",
    notes: "",
    jobUrl: "",
  });

  useEffect(() => {
    async function loadJob() {
      if (!user || !jobId) return;
      
      try {
        const docRef = doc(db, "jobs", jobId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Job;
          // Verify ownership
          if (data.userId !== user.uid) {
            toast.error("Job not found");
            router.push("/");
            return;
          }
          setJob(data);
          setFormData({
            jobTitle: data.jobTitle || "",
            company: data.company || "",
            location: data.location || "",
            description: data.description || "",
            notes: data.notes || "",
            jobUrl: data.jobUrl || "",
          });
        } else {
          toast.error("Job not found");
          router.push("/");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load job");
      } finally {
        setLoading(false);
      }
    }
    
    if (!authLoading) {
      loadJob();
    }
  }, [user, jobId, authLoading, router]);

  const handleSave = async () => {
    if (!jobId || !user) return;
    setSaving(true);
    try {
      await updateJobWithLog(user.uid, jobId, formData.company, formData);
      toast.success("Job updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    if (!user || !job) return;
    
    try {
      await deleteJob(jobId, user.uid, job.company);
      toast.success("Job deleted");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete job");
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <p className="text-muted-foreground">Please log in to view job details.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Skeleton className="h-12 w-48 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Job</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{job.company}</span>
            <span className="text-sm font-normal text-muted-foreground">
              Status: {job.status}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Berlin, Remote"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input
              id="jobUrl"
              value={formData.jobUrl}
              onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Your personal notes about this application..."
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
