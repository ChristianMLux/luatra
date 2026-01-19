"use client";

import { useAuth } from "@repo/core";
import { Card, Skeleton } from "@repo/ui";
import { FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";
import { NewProjectButton } from "@/components/projects/NewProjectButton";
import { getProjects } from "@/lib/services/projectService";
import { Project } from "@/lib/types";

export default function ProjectsPage() {
  const { user, loading } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      try {
        const data = await getProjects(user.uid);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    }
    fetchProjects();
  }, [user]);

  if (loading || loadingProjects) {
    return (
      <main className="min-h-screen p-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4">
          <p className="text-muted-foreground">Please log in to view projects.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>
          <NewProjectButton />
        </div>

        {projects.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            <FolderKanban className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No Projects Yet</h2>
            <p>Create your first project to organize your time entries.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    {project.client && (
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    )}
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between text-xs text-muted-foreground">
                   <span>Wait for reports feature</span>
                   <span>{project.isArchived ? 'Archived' : 'Active'}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
