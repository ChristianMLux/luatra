"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@repo/core";
import { getUserProfile } from "@/lib/services/profileService";
import { UserProfile } from "@/lib/types";
import { Button } from "@repo/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import { Edit, Mail, Phone, MapPin, Briefcase, GraduationCap, Code, Globe } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils"; // Assuming utils has formatDate, if not I'll need to add it

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user) {
        setLoading(true);
        try {
          const p = await getUserProfile(user.uid);
          setProfile(p);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
         setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-muted/20 rounded-xl border border-dashed mt-8">
        <h2 className="text-2xl font-bold mb-2">No Profile Found</h2>
        <p className="text-muted-foreground mb-6">Create your profile to start generating CVs.</p>
        <Link href="/profile/create">
          <Button>Create Profile</Button>
        </Link>
      </div>
    );
  }

  const { personalDetails, experience, education, skills, languages } = profile;

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 rounded-full bg-cyber-neon/10 flex items-center justify-center text-3xl font-bold text-cyber-neon border-2 border-cyber-neon">
             {personalDetails.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={personalDetails.photo} alt="Profile" className="w-full h-full object-cover rounded-full" />
             ) : (
                <span>{personalDetails.firstName?.[0]}{personalDetails.lastName?.[0]}</span>
             )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{personalDetails.firstName} {personalDetails.lastName}</h1>
            <div className="flex flex-col gap-1 mt-2 text-muted-foreground text-sm">
               {personalDetails.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {personalDetails.email}</div>}
               {personalDetails.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {personalDetails.phone}</div>}
               {personalDetails.address && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {personalDetails.address}, {personalDetails.city}</div>}
            </div>
          </div>
        </div>
        <Link href="/profile/edit">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </Link>
      </div>

      {profile.summary && (
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-muted-foreground">{profile.summary}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="h-full">
           <CardHeader>
              <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-cyber-neon" /> Experience</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              {experience.map((exp, i) => (
                 <div key={i} className="relative pl-4 border-l-2 border-muted pb-4 last:pb-0">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyber-neon" />
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-sm text-cyber-neon font-medium">{exp.company}</p>
                    <p className="text-xs text-muted-foreground mb-2">
                       {formatDate(exp.startDate)} - {exp.ongoing ? "Present" : formatDate(exp.endDate)}
                    </p>
                    {exp.description && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{exp.description}</p>}
                 </div>
              ))}
              {experience.length === 0 && <p className="text-muted-foreground italic">No experience added.</p>}
           </CardContent>
        </Card>

        <Card className="h-full">
           <CardHeader>
              <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-cyber-neon" /> Education</CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
              {education.map((edu, i) => (
                 <div key={i} className="relative pl-4 border-l-2 border-muted pb-4 last:pb-0">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyber-neon" />
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-sm text-cyber-neon font-medium">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground mb-2">
                       {formatDate(edu.startDate)} - {edu.ongoing ? "Present" : formatDate(edu.endDate)}
                    </p>
                 </div>
              ))}
              {education.length === 0 && <p className="text-muted-foreground italic">No education added.</p>}
           </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Code className="w-5 h-5 text-cyber-neon" /> Skills</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                     <Badge key={i} variant="secondary">{skill.name}</Badge>
                  ))}
                  {skills.length === 0 && <p className="text-muted-foreground italic">No skills added.</p>}
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-cyber-neon" /> Languages</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-2">
                  {languages.map((lang, i) => (
                     <div key={i} className="flex justify-between items-center text-sm border-b last:border-0 pb-2">
                        <span>{lang.name}</span>
                        <Badge variant="outline">{lang.level}</Badge>
                     </div>
                  ))}
                  {languages.length === 0 && <p className="text-muted-foreground italic">No languages added.</p>}
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
