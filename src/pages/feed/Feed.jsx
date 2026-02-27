import { useEffect, useState } from "react";
import { X, Check, Github, CodeSquare, AlertCircle } from "lucide-react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { FeedThunk } from "@/features/feed/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ProfileWindowModal from "@/components/ProfileWindowModal";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";

export default function Feed() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.feed.users);
  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [swipedLimit, setSwipedLimit] = useState(0);
  const [exitX, setExitX] = useState(0); // For programmatic swipe animation
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.9, 1, 0.9]);
  
  const MAX_SWIPES = 15;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const feedFetch = async () => {
      try {
        await dispatch(FeedThunk()).unwrap();
      } catch (err) {
        toast.error("Failed to fetch developers");
      }
    };
    feedFetch();
  }, [dispatch]);

  useEffect(() => {
    if (users && users.length > 0) {
      setProfiles(users);
    } else {
      setProfiles([]);
    }
  }, [users]);

  // Actual API call handling for swipe
  const handleSwipe = async (direction) => {
    const currentUser = profiles[index];
    if (!currentUser) return;

    if (swipedLimit >= MAX_SWIPES) {
      toast.warning("Daily swipe limit reached! Come back tomorrow.");
      return;
    }

    try {
      const status = direction === "right" ? "interested" : "ignored";
      
      // Animate card out
      setExitX(direction === 'right' ? 300 : -300);
      
      // Fire request without waiting to make UI snappy
      axios.post(`${BASE_URL}/request/send/${status}/${currentUser._id}`, {}, { withCredentials: true })
        .catch(err => toast.error(err?.response?.data?.error || "Failed to process request"));
      
      setSwipedLimit(prev => prev + 1);
      
      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setExitX(0); // Reset for next card
        x.set(0); 
      }, 200); // give time for animation to finish
      
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to process request");
    }
  };
  
  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
      handleSwipe('left');
    } else {
      x.set(0); // Snap back if not swiped far enough
    }
  };

  const current = profiles[index];

  return (
    <div className="flex flex-col h-full max-w-md mx-auto items-center py-4 relative font-sans">
      
      {/* Header Info */}
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <h1 className="text-xl font-bold font-mono text-primary">
          DevFeed
        </h1>
        <div className="flex items-center gap-2 bg-muted px-3 py-1.5 border border-border">
          <span className="w-2 h-2 bg-accent animate-pulse"></span>
          <span className="text-xs font-mono font-medium text-muted-foreground">
            {MAX_SWIPES - swipedLimit} swp left
          </span>
        </div>
      </div>

      {swipedLimit >= MAX_SWIPES ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold">Out of Swipes</h2>
          <p className="text-muted-foreground">No more swipes for today! You've hit your limit of {MAX_SWIPES}.</p>
        </div>
      ) : current ? (
        <>
          {/* Main Card */}
          <div className="flex-1 w-full relative flex items-center justify-center pointer-events-none">
            
            {!isModalOpen && (
              <div className="absolute inset-0 z-0 flex gap-4 p-8 pointer-events-none opacity-0 md:opacity-100 items-center">
                {/* Background hints for desktop */}
                <div className="flex-1 h-full border-2 border-dashed border-destructive/20 rounded-2xl flex items-center justify-center text-destructive/20 font-bold font-mono text-2xl tracking-widest invisible lg:visible">
                  IGNORED
                </div>
                <div className="flex-1 h-full border-2 border-dashed border-accent/20 rounded-2xl flex items-center justify-center text-accent/20 font-bold font-mono text-xl tracking-widest invisible lg:visible">
                  INTERESTED
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {current && (
                <motion.div 
                  key={current._id}
                  style={{ x, rotate, opacity, scale }}
                  drag={!isModalOpen ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={handleDragEnd}
                  initial={{ scale: 0.95, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0, x: exitX }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute inset-x-0 h-full w-full overflow-hidden rounded-2xl bg-card border border-border shadow-xl cursor-grab active:cursor-grabbing pointer-events-auto"
                  onClick={(e) => {
                    // Prevent opening modal if user is dragging
                    if (Math.abs(x.get()) < 5) {
                      setIsModalOpen(true);
                    }
                  }}
                >
                  {/* Card Image */}
              <div className="relative w-full h-[60%] bg-muted">
                {current.photoUrl ? (
                  <img src={current.photoUrl} alt={current.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-primary/10 text-primary">
                    <span className="text-8xl font-mono font-bold">{current.firstName?.charAt(0)}</span>
                  </div>
                )}
                
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-2 drop-shadow-md">
                    {current.firstName} {current.lastName}, {current.age || ''}
                  </h2>
                  <p className="text-sm font-mono opacity-90 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    {current.experience} Developer
                  </p>
                </div>
              </div>

              {/* Card Details */}
              <div className="h-[40%] p-5 flex flex-col gap-4 bg-card">
                
                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-[60px]">
                  {current.skills?.slice(0, 5).map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-muted text-muted-foreground rounded-md text-xs font-mono border border-border">
                      {skill}
                    </span>
                  ))}
                  {current.skills?.length > 5 && (
                    <span className="px-2.5 py-1 bg-muted/50 text-muted-foreground/70 rounded-md text-xs font-mono">
                      +{current.skills.length - 5}
                    </span>
                  )}
                </div>

                {/* GitHub link snippet */}
                {current.githubUsername && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/50 font-mono">
                    <Github size={16} />
                    <span>github.com/{current.githubUsername}</span>
                  </div>
                )}
                
                <p className="text-sm text-foreground/80 line-clamp-2 italic">
                  "{current.about || "Let my code do the talking."}"
                </p>
              </div>
            </motion.div>
              )}
            </AnimatePresence>
            
            {/* View Full Profile Hint */}
            <div className="absolute top-4 right-4 pointer-events-none opacity-70 z-10">
               <span className="bg-black/80 text-white text-xs px-2 py-1 border border-border font-mono backdrop-blur-md">
                 Tap for details
               </span>
            </div>
          </div>

          {/* Action Buttons Removed - Swipe is implemented */}
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
          <h2 className="text-2xl font-bold mt-4">No more devs found</h2>
          <p className="text-muted-foreground">You've reached the end of the line. Check back later for new potential matches.</p>
        </div>
      )}

      {/* Full Profile Modal */}
      <ProfileWindowModal 
        user={current} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSwipe={handleSwipe}
      />
      
    </div>
  );
}
