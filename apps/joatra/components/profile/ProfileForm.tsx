"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@repo/core";
import { getUserProfile, createUserProfile, updateUserProfile } from "@/lib/services/profileService";
import { UserProfile, Experience, Education, Skill, Language, PersonalDetails } from "@/lib/types";
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton, Input, Label, Textarea, Select, Checkbox } from "@repo/ui";
import { toast } from "@repo/ui";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

interface ProfileFormProps {
  mode?: "create" | "edit";
}

const emptyPersonalDetails: PersonalDetails = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
};

const emptyExperience: Omit<Experience, "id"> = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
  ongoing: false,
};

const emptyEducation: Omit<Education, "id"> = {
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  ongoing: false,
};

export function ProfileForm({ mode = "create" }: ProfileFormProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Form state
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(emptyPersonalDetails);
  const [summary, setSummary] = useState("");
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState({ name: "", level: "B1" as Language["level"] });

  // Load existing profile in edit mode
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setProfileId(profile.id || null);
          setPersonalDetails(profile.personalDetails);
          setSummary(profile.summary || "");
          setExperience(profile.experience || []);
          setEducation(profile.education || []);
          setSkills(profile.skills || []);
          setLanguages(profile.languages || []);
        } else if (mode === "edit") {
          // No profile exists, redirect to create
          router.push("/profile/create");
          return;
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadProfile();
    }
  }, [user, authLoading, mode, router]);

  const handleSave = async () => {
    if (!user) return;
    
    if (!personalDetails.firstName || !personalDetails.lastName || !personalDetails.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    setSaving(true);
    try {
      const profileData = {
        personalDetails,
        summary,
        experience,
        education,
        skills,
        languages,
      };

      if (profileId) {
        await updateUserProfile(profileId, profileData, user.uid);
        toast.success("Profile updated successfully!");
      } else {
        await createUserProfile(user.uid, profileData);
        toast.success("Profile created successfully!");
      }
      router.push("/profile");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Experience handlers
  const addExperience = () => {
    setExperience([...experience, { ...emptyExperience, id: Date.now().toString() }]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value } as Experience;
    setExperience(updated);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // Education handlers
  const addEducation = () => {
    setEducation([...education, { ...emptyEducation, id: Date.now().toString() }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string | boolean) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value } as Education;
    setEducation(updated);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Skills handlers
  const addSkill = () => {
    if (!newSkill.trim()) return;
    setSkills([...skills, { name: newSkill.trim(), id: Date.now().toString() }]);
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Language handlers
  const addLanguage = () => {
    if (!newLanguage.name.trim()) return;
    setLanguages([...languages, { ...newLanguage }]);
    setNewLanguage({ name: "", level: "B1" });
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Skeleton className="h-12 w-48 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="text-muted-foreground">Please log in to manage your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === "create" ? "Create Profile" : "Edit Profile"}
        </h1>
      </div>

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" required>First Name</Label>
              <Input
                id="firstName"
                value={personalDetails.firstName}
                onChange={(e) => setPersonalDetails({ ...personalDetails, firstName: e.target.value })}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" required>Last Name</Label>
              <Input
                id="lastName"
                value={personalDetails.lastName}
                onChange={(e) => setPersonalDetails({ ...personalDetails, lastName: e.target.value })}
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" required>Email</Label>
              <Input
                id="email"
                type="email"
                value={personalDetails.email}
                onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={personalDetails.phone || ""}
                onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                placeholder="+49 123 456789"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={personalDetails.city || ""}
                onChange={(e) => setPersonalDetails({ ...personalDetails, city: e.target.value })}
                placeholder="Berlin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={personalDetails.postalCode || ""}
                onChange={(e) => setPersonalDetails({ ...personalDetails, postalCode: e.target.value })}
                placeholder="10115"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={personalDetails.country || ""}
                onChange={(e) => setPersonalDetails({ ...personalDetails, country: e.target.value })}
                placeholder="Germany"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            placeholder="Brief overview of your professional background and goals..."
          />
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Experience</CardTitle>
          <Button variant="outline" size="sm" onClick={addExperience}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {experience.map((exp, index) => (
            <div key={exp.id || index} className="border border-glass-border rounded-lg p-4 space-y-4 relative bg-glass-low">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-cyber-pink hover:text-cyber-pink/80"
                onClick={() => removeExperience(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-2 gap-4 pr-8">
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(index, "position", e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                    placeholder="Tech Corp"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={typeof exp.startDate === "string" ? exp.startDate : ""}
                    onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={typeof exp.endDate === "string" ? exp.endDate : ""}
                    onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                    disabled={exp.ongoing}
                  />
                </div>
                <div className="flex items-end pb-2">
                  <Checkbox
                    checked={exp.ongoing || false}
                    onChange={(e) => updateExperience(index, "ongoing", e.target.checked)}
                    label="Current position"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={exp.description || ""}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  rows={3}
                  placeholder="Key responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
          {experience.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No experience added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button variant="outline" size="sm" onClick={addEducation}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {education.map((edu, index) => (
            <div key={edu.id || index} className="border border-glass-border rounded-lg p-4 space-y-4 relative bg-glass-low">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-cyber-pink hover:text-cyber-pink/80"
                onClick={() => removeEducation(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-2 gap-4 pr-8">
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                    placeholder="Bachelor of Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                    placeholder="University of Berlin"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  value={edu.field}
                  onChange={(e) => updateEducation(index, "field", e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={typeof edu.startDate === "string" ? edu.startDate : ""}
                    onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={typeof edu.endDate === "string" ? edu.endDate : ""}
                    onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                    disabled={edu.ongoing}
                  />
                </div>
                <div className="flex items-end pb-2">
                  <Checkbox
                    checked={edu.ongoing || false}
                    onChange={(e) => updateEducation(index, "ongoing", e.target.checked)}
                    label="Currently enrolled"
                  />
                </div>
              </div>
            </div>
          ))}
          {education.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No education added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            />
            <Button variant="outline" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={skill.id || index}
                className="inline-flex items-center gap-1 bg-glass-medium border border-glass-border px-3 py-1 rounded-full text-sm"
              >
                {skill.name}
                <button
                  onClick={() => removeSkill(index)}
                  className="text-muted-foreground hover:text-cyber-pink transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newLanguage.name}
              onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
              placeholder="Language..."
              className="flex-1"
            />
            <Select
              value={newLanguage.level}
              onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value as Language["level"] })}
              className="w-32"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
              <option value="Muttersprache">Native</option>
            </Select>
            <Button variant="outline" onClick={addLanguage}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {languages.map((lang, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-glass-border last:border-0 pb-2"
              >
                <span>{lang.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground bg-glass-low px-2 py-0.5 rounded">{lang.level}</span>
                  <button
                    onClick={() => removeLanguage(index)}
                    className="text-muted-foreground hover:text-cyber-pink transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
