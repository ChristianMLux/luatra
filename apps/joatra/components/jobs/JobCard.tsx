"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@repo/core";
import { Job } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { updateJobWithLog, deleteJob } from "@/lib/services/jobService";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@repo/ui";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Calendar, Building, MapPin, DollarSign, Trash2, Edit, FileText } from "lucide-react";

import { toast } from "@repo/ui";

interface JobCardProps {
  job: Job;
  onUpdate: () => void;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "Gespeichert": "outline",
  "Beworben": "secondary",
  "Interview": "default", // primary
  "Angebot": "default", 
  "Abgelehnt": "destructive"
};

export function JobCard({ job, onUpdate }: JobCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this job application?")) return;
    setIsDeleting(true);
    try {
      await deleteJob(job.id!, user?.uid, job.company);
      onUpdate();
      toast.success("Job deleted");
    } catch (e) {
      toast.error("Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (status: Job["status"]) => {
    if (!user) return;
    try {
      await updateJobWithLog(user.uid, job.id!, job.company, { status });
      onUpdate();
      toast.success(`Status updated to ${status}`);
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold truncate pr-4" title={job.jobTitle}>
              {job.jobTitle}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Building className="w-4 h-4 mr-1" />
              {job.company}
              {job.location && (
                <>
                  <MapPin className="w-4 h-4 ml-2 mr-1" />
                  {job.location}
                </>
              )}
            </CardDescription>
          </div>
          <Badge variant={statusColors[job.status] || "outline"}>
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(job.applicationDate)}
          </div>
          {job.salary?.min && (
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              {job.salary.min} {job.salary.max && `- ${job.salary.max}`} {job.salary.currency}
            </div>
          )}
        </div>
        
        {job.matchScore !== undefined && (
             <div className="mt-3 bg-muted/50 p-2 rounded text-xs">
                <span className="font-semibold">AI Match: {job.matchScore}%</span>
                {job.matchReasoning && <span className="block mt-1 text-muted-foreground line-clamp-2">{job.matchReasoning}</span>}
             </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" onClick={() => router.push(`/jobs/${job.id}`)}>
          Details
        </Button>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" onClick={() => router.push(`/jobs/${job.id}`)} title="Edit">
              <Edit className="w-4 h-4" />
           </Button>
           <Button variant="ghost" size="icon" onClick={() => router.push(`/cv-generator?jobId=${job.id}`)} title="Generate CV">
              <FileText className="w-4 h-4" />
           </Button>
           <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleDelete} disabled={isDeleting} title="Delete">
              <Trash2 className="w-4 h-4" />
           </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
