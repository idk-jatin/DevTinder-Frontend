import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';
import { toast } from 'sonner';
import { MessageSquare, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/matches`, { withCredentials: true });
        setMatches(res.data.matchList || []);
      } catch (err) {
        toast.error('Failed to load matches');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-full flex flex-col font-sans">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Your Matches</h1>
        <p className="text-muted-foreground mt-1 text-sm">Developers who swiped right on you too.</p>
      </div>

      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-card border border-border rounded-xl border-dashed">
          <MessageSquare size={48} className="text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold">No matches yet</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Keep swiping! When you and another developer like each other, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8 overflow-y-auto">
          {matches.map((match) => (
            <div key={match._id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors flex flex-col group">
              <div className="aspect-[4/3] w-full bg-muted relative">
                {match.photoUrl ? (
                  <img src={match.photoUrl} alt={match.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-mono font-bold">
                    {match.firstName?.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-lg leading-tight">{match.firstName} {match.lastName}</h3>
                  <p className="text-xs font-mono opacity-90">{match.experience} Developer</p>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-1 mb-4 h-[50px] overflow-hidden">
                  {match.skills?.slice(0, 4).map(skill => (
                    <span key={skill} className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-mono rounded">
                      {skill}
                    </span>
                  ))}
                  {match.skills?.length > 4 && (
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-mono rounded">
                      +{match.skills.length - 4}
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-border flex gap-2">
                  <button 
                    onClick={() => navigate(`/chat?userId=${match._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <MessageSquare size={16} /> Chat
                  </button>
                  {match.githubUsername && (
                    <a 
                      href={`https://github.com/${match.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-muted text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted/80 transition-colors"
                    >
                      <Github size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
