import React from 'react';
import { Moon, Bell, Shield, LogOut, Trash2 } from 'lucide-react';
import { ModeToggle } from '@/components/mood-toggle';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { LogoutThunk } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(LogoutThunk()).unwrap();
      navigate('/login');
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Failed to logout");
    }
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requires manual confirmation in this version. Contact support.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans pb-10">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm font-mono">Configure your developer experience.</p>
      </div>

      <div className="space-y-6">
        
        {/* Appearance */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="font-bold flex items-center gap-2 font-mono">
              <Moon size={18} className="text-primary" /> Appearance
            </h2>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium">Theme Preference</p>
              <p className="text-sm text-muted-foreground">Choose between light, dark, or system defined.</p>
            </div>
            <ModeToggle />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="font-bold flex items-center gap-2 font-mono">
              <Bell size={18} className="text-primary" /> Notifications
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Matches</p>
                <p className="text-sm text-muted-foreground">Get notified when someone swipes right on you.</p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Direct Messages</p>
                <p className="text-sm text-muted-foreground">Receive alerts for new messages.</p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        </div>

        {/* Account & Security */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="font-bold flex items-center gap-2 font-mono">
              <Shield size={18} className="text-primary" /> Account & Security
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Log out</p>
                <p className="text-sm text-muted-foreground">End your current session.</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="flex gap-2">
                <LogOut size={16} /> Logout
              </Button>
            </div>
            
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-destructive">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently remove your profile and data.</p>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount} className="flex gap-2">
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
