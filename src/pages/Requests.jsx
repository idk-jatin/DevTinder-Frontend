import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';
import { toast } from 'sonner';
import { UserCheck, UserX, UserSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests`, { withCredentials: true });
      setRequests(res.data.pendingRequests || []);
    } catch (err) {
      toast.error('Failed to load pending requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleReview = async (status, requestId) => {
    try {
      await axios.post(`${BASE_URL}/request/review/${status}/${requestId}`, {}, { withCredentials: true });
      toast.success(`Request ${status} successfully!`);
      // Remove the reviewed request from the local state
      setRequests(requests.filter(req => req._id !== requestId));
    } catch (err) {
      toast.error(err?.response?.data?.error || `Failed to ${status} request`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col font-sans">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          Pending Requests
          {requests.length > 0 && (
            <span className="bg-primary text-primary-foreground text-sm py-0.5 px-2.5 rounded-full font-mono">
              {requests.length}
            </span>
          )}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Developers who want to connect with you.</p>
      </div>

      {requests.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-card border border-border rounded-xl border-dashed relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-5 pointer-events-none"></div>
          <UserSearch size={48} className="text-muted-foreground mb-4 relative z-10" />
          <h2 className="text-xl font-bold relative z-10">No pending requests</h2>
          <p className="text-muted-foreground mt-2 max-w-sm relative z-10">
            Make sure your profile is fully complete to attract more connection requests!
          </p>
        </div>
      ) : (
        <div className="space-y-4 pb-8 overflow-y-auto pr-2">
          {requests.map((req) => {
            const user = req.fromUserId;
            if (!user) return null; // Edge case if populated user is null

            return (
              <div key={req._id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between gap-4 hover:border-primary/30 transition-colors">
                
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-full bg-muted shrink-0 overflow-hidden relative">
                    {user.photoUrl ? (
                      <img src={user.photoUrl} alt={user.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl font-mono font-bold">
                        {user.firstName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-lg truncate flex items-center gap-2">
                      {user.firstName} {user.lastName}
                      <span className="text-xs font-normal text-muted-foreground font-mono">({user.age || 'N/A'})</span>
                    </h3>
                    <p className="text-sm text-foreground/80 truncate">
                      {user.experience} Developer
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1 italic">
                      "{user.about || "Let my code do the talking."}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleReview("rejected", req._id)}
                    className="h-10 w-10 border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
                  >
                    <UserX size={18} />
                  </Button>
                  <Button 
                    onClick={() => handleReview("accepted", req._id)}
                    className="h-10 px-4 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <UserCheck size={18} /> Accept
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
