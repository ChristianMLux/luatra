"use client";

import { useState } from "react";
import { useAuth } from "@repo/core";
import { Button, Input, Modal } from "@repo/ui";
import { Plus } from "lucide-react";
import { addProject } from "@/lib/services/projectService";
import { useRouter } from "next/navigation";

export function NewProjectButton() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setLoading(true);
    try {
      await addProject(user.uid, {
        name: name.trim(),
        client: client.trim() || undefined,
        color: "#3B82F6", // Default blue
      });
      setIsOpen(false);
      setName("");
      setClient("");
      router.refresh(); // Refresh to show new project
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="w-4 h-4" />
        New Project
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Name</label>
            <Input
              placeholder="e.g., Website Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Client (Optional)</label>
            <Input
              placeholder="e.g., Acme Corp"
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
