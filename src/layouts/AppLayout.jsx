import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ModeToggle } from '../components/mood-toggle';
import { Bell, UserPlus, MessageSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import ProfileCompletionModal from '../components/ProfileCompletionModal';
import { motion, AnimatePresence } from 'framer-motion';

const AppLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  
  const showCompletionModal = user && user.profileCompleted === false;

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/requests`, { withCredentials: true });
        if (res.data?.pendingRequests) {
          const formattedNotifs = res.data.pendingRequests.map(req => ({
            id: req._id,
            type: 'request',
            text: `${req.fromUserId.firstName} sent you a connection request`,
            time: new Date(req.createdAt).toLocaleDateString(),
            icon: <UserPlus size={16} className="text-accent" />
          }));
          setNotifications(formattedNotifs);
        }
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    fetchNotifications();
  }, [user]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-10 shrink-0">
          
          <div className="md:hidden w-10"></div> 
          
          <div className="hidden md:flex font-mono text-sm text-muted-foreground">
            ~/dev/tinder
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            {/* Notification Bell with Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-none relative transition-colors"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-card border border-border shadow-2xl rounded-none overflow-hidden z-[150] animate-in slide-in-from-top-2">
                  <div className="p-3 border-b border-border bg-muted/50">
                    <h3 className="font-bold text-sm font-mono">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className="p-3 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors flex gap-3 items-start"
                        onClick={() => {
                          setShowNotifications(false);
                          if(notif.type === 'request') navigate('/requests');
                          if(notif.type === 'match') navigate('/matches');
                          if(notif.type === 'message') navigate('/chat');
                        }}
                      >
                        <div className="p-2 bg-background rounded-none shrink-0 border border-border">
                          {notif.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{notif.text}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">{notif.time}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No new notifications
                      </div>
                    )}
                  </div>
                  <div className="p-2 text-center border-t border-border bg-muted/30 hover:bg-muted transition-colors cursor-pointer text-sm text-primary font-medium" onClick={() => navigate('/notifications')}>
                    View All
                  </div>
                </div>
              )}
            </div>
            <ModeToggle />
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 bg-background">
          <div className="mx-auto max-w-5xl h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Render Profile Completion Modal at root level of layout */}
      <ProfileCompletionModal 
        isOpen={showCompletionModal} 
        onClose={null} // Force them to complete it, or provide a skip function
        user={user} 
      />
    </div>
  );
};

export default AppLayout;
