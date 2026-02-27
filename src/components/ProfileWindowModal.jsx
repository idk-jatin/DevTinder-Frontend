import React from 'react';
import { X, Github, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export default function ProfileWindowModal({ user, isOpen, onClose, onSwipe }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-card w-full max-w-2xl rounded-none border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        
        {/* Header Actions */}
        <div className="p-4 flex justify-end absolute top-0 right-0 z-10 w-full bg-gradient-to-b from-black/50 to-transparent">
          <button 
            onClick={onClose} 
            className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-none border border-white/20 backdrop-blur-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {/* Header Image Area */}
          <div className="relative h-64 sm:h-80 bg-muted">
            {user.photoUrl ? (
              <img src={user.photoUrl} alt={user.firstName} className="w-full h-full object-cover" />
            ) : (
              <img src={`https://api.dicebear.com/9.x/croodles-neutral/svg?seed=${user.firstName || user._id}`} alt={user.firstName} className="w-full h-full object-cover bg-primary/10" />
            )}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background to-transparent pt-20">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                {user.firstName} {user.lastName} 
                <span className="text-xl font-normal text-muted-foreground">{user.age || 'N/A'}</span>
              </h2>
              <p className="text-muted-foreground font-mono flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                {user.experience} Developer
              </p>
            </div>
          </div>

          <div className="p-6 space-y-8">
            
            {/* About */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-mono">Readme.md</h3>
              <p className="text-foreground leading-relaxed">
                {user.about || "This user prefers to let their code speak for itself."}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-mono">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-none text-sm font-medium font-mono border border-primary/20">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground">No skills specified</span>
                )}
              </div>
            </div>

            {/* Links */}
            {user.githubUsername && (
              <div className="space-y-3 pb-8">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-mono">Links</h3>
                <a 
                  href={`https://github.com/${user.githubUsername}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-accent/20 border border-border rounded-lg transition-colors font-mono text-sm"
                >
                  <Github size={18} />
                  github.com/{user.githubUsername}
                  <ExternalLink size={14} className="ml-2 opacity-50" />
                </a>
              </div>
            )}
            
          </div>
        </div>

        {/* Action Footer Removed - Swipe is handled in Feed */}
      </div>
    </div>
  );
}
