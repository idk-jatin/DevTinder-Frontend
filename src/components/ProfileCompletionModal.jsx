import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Camera, Github, Plus, X, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';

// Assuming you have an action to update user profile locally
import { updateUser } from '@/features/auth/authSlice';

const experienceLevels = ['Student', 'Entry', 'Junior', 'Intermediate', 'Senior', 'Lead'];
const commonSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'Java', 'Go', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL', 'GraphQL'];

export default function ProfileCompletionModal({ isOpen, onClose, user }) {
  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.photoUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      age: user?.age || '',
      gender: user?.gender || 'Others',
      experience: user?.experience || 'Entry',
      githubUsername: user?.githubUsername || '',
      linkedinProfile: user?.linkedinProfile || '',
      about: user?.about || ''
    }
  });

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addSkill = (skill) => {
    if (skill && !skills.includes(skill.toLowerCase()) && skills.length < 10) {
      setSkills([...skills, skill.toLowerCase()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // 1. Upload Image (Optional)
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        await axios.put(`${BASE_URL}/profile/edit/upload`, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // 2. Update Profile Data
      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age ? Number(data.age) : undefined,
        gender: data.gender,
        skills,
        experience: data.experience,
        githubUsername: data.githubUsername,
        linkedinProfile: data.linkedinProfile,
        about: data.about
      };

      await axios.patch(`${BASE_URL}/profile/edit`, profileData, { withCredentials: true });
      
      dispatch(updateUser({ ...profileData, profileCompleted: true, photoUrl: previewUrl }));

      toast.success("Profile initialized successfully!");
      if (onClose) {
         onClose();
      } else {
         navigate('/feed');
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-full">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/50">
          <div>
            <h2 className="text-xl font-bold font-mono tracking-tight text-primary">Initialize Profile</h2>
            <p className="text-sm text-muted-foreground">Setup your developer identity to find matches.</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Step 1: Avatar */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">01. Avatar</h3>
              <div className="flex items-center gap-6">
                <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  )}
                  <label className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Upload className="w-6 h-6 text-foreground" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Upload a profile picture.</p>
                  <p className="text-xs">JPG or PNG. Max 5MB.</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Step 2: Basic Info */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">02. Basic Info</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name *</label>
                    <Input placeholder="Linus" className="font-mono bg-card" required {...register("firstName")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input placeholder="Torvalds" className="font-mono bg-card" {...register("lastName")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age</label>
                    <Input type="number" min="18" max="100" placeholder="25" className="font-mono bg-card" {...register("age")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gender</label>
                    <select 
                      {...register("gender")}
                      className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                    >
                      {['Male', 'Female', 'Others'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Experience */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">03. Level</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience Level</label>
                  <select 
                    {...register("experience")}
                    className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  >
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 4: Network */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">04. Network</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Github size={16} /> GitHub
                    </label>
                    <Input 
                      placeholder="torvalds" 
                      className="font-mono bg-card"
                      {...register("githubUsername")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                       LinkedIn URL
                    </label>
                    <Input 
                      placeholder="https://linkedin.com/in/torvalds" 
                      className="font-mono bg-card"
                      {...register("linkedinProfile")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Skills */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">05. Tech Stack</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. React, Python, Docker" 
                    className="font-mono bg-card"
                  />
                  <Button type="button" onClick={() => addSkill(skillInput.trim())} variant="secondary" className="px-3">
                    <Plus size={18} />
                  </Button>
                </div>
                {/* Selected Skills Chips */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-md border border-border/50 min-h-[50px]">
                    {skills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-foreground">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs text-muted-foreground mr-1 self-center">Suggestions:</span>
                  {commonSkills.filter(s => !skills.includes(s.toLowerCase())).slice(0, 6).map(skill => (
                    <button 
                      key={skill} type="button" 
                      onClick={() => addSkill(skill)}
                      className="text-xs px-2 py-0.5 rounded border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 6: Bio */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">06. Readme.md</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Short Bio</label>
                <Textarea 
                  placeholder="I build scalable backends and love debating tabs vs spaces..." 
                  className="font-mono bg-card min-h-[100px] resize-y"
                  {...register("about")}
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/50 flex justify-end gap-3">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Skip for now
            </Button>
          )}
          <Button type="submit" form="profile-form" disabled={isSubmitting} className="font-mono">
            {isSubmitting ? "Compiling..." : "Save & Continue"}
          </Button>
        </div>

      </div>
    </div>
  );
}
