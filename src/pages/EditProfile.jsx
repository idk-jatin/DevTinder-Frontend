import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Github, Edit3, Mail, CodeSquare, Calendar, Link as LinkIcon, ExternalLink, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileCompletionModal from '@/components/ProfileCompletionModal';

export default function ProfilePage() {
  const user = useSelector(state => state.auth.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-10">
      
      {/* Header & Cover */}
      <div className="bg-card border border-border rounded-xl overflow-hidden relative shadow-sm">
        {/* Decorative Cover */}
        <div className="h-32 sm:h-48 w-full bg-muted relative">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none"></div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-4 z-10 relative">
            <Avatar className="w-32 h-32 border-4 border-card bg-muted shadow-lg">
              <AvatarImage src={user.photoUrl} alt={user.firstName} className="object-cover" />
              <AvatarFallback className="text-4xl font-mono font-bold text-primary bg-primary/10">
                {user.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                  {user.firstName} {user.lastName} 
                  {user.age && <span className="text-xl text-muted-foreground font-normal">, {user.age}</span>}
                </h1>
                <p className="text-muted-foreground font-mono flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  {user.experience} Developer
                </p>
              </div>
              <Button 
                onClick={() => setIsEditModalOpen(true)}
                className="font-mono flex items-center gap-2"
                variant="outline"
              >
                <Edit3 size={16} /> Edit Profile
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-muted-foreground mt-4 mb-6">
            <div className="flex items-center gap-1.5 font-mono">
              <Mail size={16} className="text-primary/70" />
              {user.emailId}
            </div>
            {user.gender && (
              <div className="flex items-center gap-1.5 font-mono capitalize">
                <User size={16} className="text-primary/70" />
                {user.gender}
              </div>
            )}
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar size={16} className="text-primary/70" />
              Joined {joinDate}
            </div>
            {user.githubUsername && (
              <a href={`https://github.com/${user.githubUsername}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono text-primary hover:underline">
                <Github size={16} />
                {user.githubUsername}
                <ExternalLink size={12} className="ml-0.5" />
              </a>
            )}
             {user.linkedinProfile && (
              <a href={user.linkedinProfile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono text-primary hover:underline">
                <LinkIcon size={16} />
                LinkedIn
                <ExternalLink size={12} className="ml-0.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left Col: Readme & Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CodeSquare className="text-primary" size={20} />
              <h2 className="text-lg font-bold font-mono tracking-tight">Readme.md</h2>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
              {user.about ? (
                <p>{user.about}</p>
              ) : (
                <p className="text-muted-foreground italic">This developer hasn't written their README yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Skills & Stats */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold font-mono tracking-tight text-muted-foreground uppercase mb-4">Tech Stack</h2>
            
            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-muted/50 text-foreground rounded-md text-sm font-mono border border-border">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
            )}
          </div>
          
          {/* Mock Stats */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold font-mono tracking-tight text-muted-foreground uppercase mb-4">Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-mono">Matches</span>
                <span className="font-bold font-mono">{user.likes || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-mono">Profile Completed</span>
                <span className="font-bold font-mono text-accent">{user.profileCompleted ? '100%' : '20%'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <ProfileCompletionModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={user} 
      />
    </div>
  );
}
