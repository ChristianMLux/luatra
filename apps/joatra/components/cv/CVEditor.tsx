"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";

export default function CVEditor({ content, onChange }: { content: any, onChange: (c: any) => void }) {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleChange = (field: string, value: any) => {
     const newContent = { ...localContent, [field]: value };
     setLocalContent(newContent);
     onChange(newContent); // Live update parent
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
     const newExp = [...localContent.experience];
     newExp[index] = { ...newExp[index], [field]: value };
     handleChange("experience", newExp);
  };

  return (
    <div className="h-full overflow-auto space-y-4 p-1">
       <Card>
          <CardHeader>
             <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
             <textarea 
                className="w-full min-h-[150px] p-2 rounded-md border text-sm"
                value={localContent.summary || ""}
                onChange={(e) => handleChange("summary", e.target.value)}
             />
          </CardContent>
       </Card>

       <Card>
          <CardHeader>
             <CardTitle>Experience Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {localContent.experience?.map((exp: any, i: number) => (
                <div key={i} className="border p-3 rounded-md">
                   <div className="font-semibold mb-2">{exp.position} at {exp.company}</div>
                   {/* We usually edit highlights array for bullet points, but simplified here as one text block or array */}
                   {/* Simplified: allow editing description as generic text area */}
                   <textarea
                     className="w-full min-h-[100px] p-2 rounded-md border text-sm"
                     value={exp.description || ""}
                     onChange={(e) => handleExperienceChange(i, "description", e.target.value)}
                     placeholder="Description..."
                   />
                   {/* Highlights if exists */}
                   {exp.highlights && (
                      <div className="mt-2">
                         <div className="text-xs font-semibold mb-1">Highlights (JSON format for now)</div>
                         <textarea
                            className="w-full min-h-[100px] p-2 rounded-md border text-sm font-mono bg-muted/50"
                            value={JSON.stringify(exp.highlights, null, 2)}
                            onChange={(e) => {
                               try {
                                  handleExperienceChange(i, "highlights", JSON.parse(e.target.value));
                               } catch(err) {
                                  // ignore parse error while typing
                               }
                            }}
                         />
                      </div>
                   )}
                </div>
             ))}
          </CardContent>
       </Card>
    </div>
  );
}
