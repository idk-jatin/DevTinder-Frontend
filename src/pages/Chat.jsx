import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';
import { io } from 'socket.io-client';
import { Send, MoreVertical, Terminal, ChevronLeft, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat() {
  const [params] = useSearchParams();
  const initialUserId = params.get('userId');
  
  const [matches, setMatches] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); 
  const [socket, setSocket] = useState(null);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/matches`, { withCredentials: true });
        let matchList = res.data.matchList || [];
        
        // Dummy data removed to prevent ObjectId CastErrors in socket room.

        setMatches(matchList);
        
        if (initialUserId) {
          const target = matchList.find(m => m._id === initialUserId);
          if (target) setActiveChat(target);
          else if (window.innerWidth >= 768) setActiveChat(matchList[0]);
        } else if (matchList.length > 0 && window.innerWidth >= 768) {
          setActiveChat(matchList[0]);
        }
      } catch (err) {
        toast.error('Failed to load chat contacts');
      }
    };
    fetchMatches();
  }, [initialUserId]);

  useEffect(() => {
    if (!activeChat) return;

    // 1. Fetch History
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chat/${activeChat._id}`, { withCredentials: true });
        if (res.data && res.data.messages) {
           setMessages(res.data.messages);
        } else {
           setMessages([]); // New chat
        }
      } catch (err) {
        toast.error("Failed to fetch chat history");
      }
    };
    fetchChatHistory();

    // 2. Initialize Socket
    const newSocket = io(BASE_URL.replace('/api', ''), {
       withCredentials: true // Sends cookies to auth middleware
    });

    newSocket.on('connect', () => {
       console.log("Socket connected!");
       newSocket.emit('joinChat', { targetUserId: activeChat._id });
    });

    newSocket.on('messageReceived', (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
    });

    newSocket.on('error', (err) => {
        toast.error(`Socket Error: ${err}`);
    });

    setSocket(newSocket);

    return () => {
       newSocket.disconnect();
    };
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat || !socket) return;
    
    // Emit to backend. The backend will save to DB and emit 'messageReceived' back to us
    socket.emit('sendMessage', {
        targetUserId: activeChat._id,
        text: message
    });
    
    // We do NOT add to local state immediately. We wait for the server broadcast to ensure it's saved.
    // This is a common pattern to avoid duplicate rendering unconfirmed messages.
    setMessage('');
  };

  const handleLike = async () => {
    if (!activeChat) return;
    try {
      const res = await axios.post(`${BASE_URL}/user/like/${activeChat._id}`, {}, { withCredentials: true });
      toast.success(res.data.message || `You liked ${activeChat.firstName}!`);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to like user");
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="flex h-[calc(100vh-8rem)] w-full gap-4 max-w-6xl mx-auto font-mono text-sm"
    >
      
      {/* Sidebar: Chat List */}
      <div className={`w-full md:w-80 bg-card border border-border flex-col shrink-0 shadow-sm relative ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
        <div className="p-4 border-b border-border bg-muted/10">
          <h2 className="font-bold text-lg flex items-center gap-2 text-primary uppercase tracking-wider">
            <Terminal size={18} /> Sessions
          </h2>
          <div className="mt-3 relative">
            <Input 
              placeholder="grep 'users'..." 
              className="bg-background border-border rounded-none text-sm h-9 font-mono focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {matches.map((match, idx) => (
            <motion.button
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
              key={match._id}
              onClick={() => setActiveChat(match)}
              className={`w-full flex items-center p-3 gap-3 border-b border-border border-dashed transition-colors hover:bg-muted/30 ${activeChat?._id === match._id ? 'bg-primary/10 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'}`}
            >
              <Avatar className="h-10 w-10 shrink-0 border border-border rounded-none bg-background">
                <AvatarImage src={match.photoUrl} alt={match.firstName} />
                <AvatarFallback className="font-mono text-primary rounded-none">{match.firstName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-sm font-bold truncate text-primary/90">{match.firstName}</h3>
                  <span className="text-[10px] text-muted-foreground">ACTV</span>
                </div>
                <p className="text-xs text-muted-foreground truncate opacity-70">
                  <span className="text-primary">{'>_'}</span> initialized...
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 bg-card border border-border flex-col shadow-sm relative overflow-hidden ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
        
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-4 md:px-6 border-b border-border border-dashed flex items-center justify-between bg-muted/10 shrink-0">
              <div className="flex items-center gap-2 md:gap-3">
                <button 
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted text-sm flex items-center transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <Avatar className="h-10 w-10 border border-border rounded-none bg-background">
                  <AvatarImage src={activeChat.photoUrl} alt={activeChat.firstName} />
                  <AvatarFallback className="text-primary rounded-none">{activeChat.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-sm tracking-wide text-primary">{activeChat.firstName} {activeChat.lastName}</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 opacity-80">
                    <span className="w-2 h-2 rounded-none bg-accent animate-pulse"></span> [CONNECTED]
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-primary/70">
                <button onClick={handleLike} className="p-2 hover:bg-red-500/10 hover:text-red-500 transition-colors" title={`Like ${activeChat.firstName}`}><Heart size={18} /></button>
                <button className="p-2 hover:bg-primary/10 hover:text-primary transition-colors"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-background/30 relative">
              <div className="text-center my-4 opacity-50">
                <span className="text-xs border border-border border-dashed px-3 py-1">
                  -- SECURE CHANNEL --
                </span>
              </div>
              
              <AnimatePresence>
                {messages.map((msg) => {
                  const senderIdStr = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
                  const isMe = senderIdStr !== activeChat._id; // If it's not the target, it must be me
                  return (
                    <motion.div 
                      key={msg._id || msg.id} 
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] px-4 py-2 text-sm border ${
                        isMe 
                          ? 'bg-primary/10 text-primary border-primary/30' 
                          : 'bg-muted/10 text-foreground border-border'
                      }`}>
                        <p className="leading-relaxed break-words">{msg.text}</p>
                        <div className={`text-[10px] mt-2 text-right opacity-50`}>
                          {formatTime(msg.timestamp || msg.createdAt)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 md:p-4 bg-card border-t border-border border-dashed shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-background border border-border p-2 focus-within:border-primary transition-colors">
                <div className="text-primary py-2 pl-2 shrink-0">{'>'}</div>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Execute..."
                  className="flex-1 max-h-32 min-h-[40px] bg-transparent resize-none outline-none py-2 text-sm placeholder:opacity-30 text-foreground"
                  rows={1}
                />
                <button 
                  type="submit" 
                  disabled={!message.trim()}
                  className="p-2 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
             <Terminal size={48} className="text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-xl font-bold tracking-widest text-muted-foreground uppercase">Awaiting Connection</h2>
          </div>
        )}
      </div>
    </motion.div>
  );
}
