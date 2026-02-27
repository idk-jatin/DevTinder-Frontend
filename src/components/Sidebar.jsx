import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  Users, 
  UserCircle, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogoutThunk } from '../features/auth/authSlice';

const navItems = [
  { name: 'Feed', path: '/feed', icon: Terminal },
  { name: 'Matches', path: '/matches', icon: Users },
  { name: 'Requests', path: '/requests', icon: UserCircle },
  { name: 'Chat', path: '/chat', icon: MessageSquare },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector(state => state.auth.user);

  const handleLogout = async () => {
    try {
      await dispatch(LogoutThunk()).unwrap();
      navigate('/login');
    } catch (error) {
       // fallback even if api fails
       navigate('/login');
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-md border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 border-r border-border bg-card text-card-foreground transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:flex md:flex-col
      `}>
        <div className="flex flex-col h-full py-6 px-4">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 px-2 mb-8">
            <Terminal className="text-primary h-8 w-8" />
            <span className="text-xl font-bold font-mono tracking-tight text-primary">
              {"DevTinder"}
            </span>
          </div>

          {/* User Profile Summary */}
          <div className="flex items-center gap-3 px-2 py-4 mb-6 rounded-lg border border-border bg-background/50 group hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/profile')}>
            <Avatar>
              <AvatarImage src={user?.photoUrl || `https://api.dicebear.com/9.x/croodles-neutral/svg?seed=${user?.firstName || 'Dev'}`} alt="@user" />
              <AvatarFallback className="font-mono bg-primary/20 text-primary">{user?.firstName?.charAt(0) || 'D'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</span>
              <span className="text-xs text-muted-foreground truncate font-mono">View Profile</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink 
                key={item.name} 
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
                `}
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Logout Button at bottom */}
          <div className="mt-auto border-t border-border pt-4">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
