"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@repo/core";
import { addJob } from "@/lib/services/jobService";
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton, Input, Label, Textarea } from "@repo/ui";
import { toast } from "@repo/ui";
import { ArrowLeft, Save } from "lucide-react";

export default function AddJobPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    location: "",
    description: "",
    notes: "",
    jobUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in first");
      return;
    }
    
    if (!formData.jobTitle || !formData.company) {
      toast.error("Job title and company are required");
      return;
    }
    
    setSaving(true);
    try {
      await addJob(user.uid, {
        ...formData,
        status: "Gespeichert",
        applicationDate: new Date(),
      });
      toast.success("Job added successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add job");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Skeleton className="h-12 w-48 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Add New Job</h1>
        <p className="text-muted-foreground">Please log in via the Hub to add jobs.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add New Job Application</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle" required>Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" required>Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Google"
                  required
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
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Paste the job description here..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Your personal notes..."
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Add Job"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
