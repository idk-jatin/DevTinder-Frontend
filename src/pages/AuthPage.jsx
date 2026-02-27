import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Terminal, Github, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoginThunk, SignupThunk } from '@/features/auth/authSlice';
import { ModeToggle } from '@/components/mood-toggle';

export default function AuthPage({ initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  
  const password = watch("password", "");

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset(); // clear errors and fields
  };

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        const response = await dispatch(LoginThunk({ emailId: data.emailId, password: data.password })).unwrap();
        toast.success(response.message || "Login Successful");
        // We'll navigate to feed or profile completion if needed
        navigate("/feed");
      } else {
        const nameParts = data.firstName.trim().split(' ');
        const payload = {
          firstName: nameParts[0],
          lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined,
          emailId: data.emailId,
          password: data.password
        };
        const response = await dispatch(SignupThunk(payload)).unwrap();
        toast.success(response.message || "Signup Successful");
        // Automatically log them in or switch to login mode
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.response?.data?.message || err?.message || "Authentication failed");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground font-sans selection:bg-primary/30">
      
      {/* Left Banner - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-card border-r border-border relative flex-col justify-between overflow-hidden">
        
        {/* Terminal decorative background */}
        <div className="absolute inset-x-0 top-0 h-6 bg-muted border-b border-border flex items-center px-4 space-x-2">
          <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
          <div className="w-3 h-3 rounded-full bg-primary/80"></div>
          <div className="w-3 h-3 rounded-full bg-accent/80"></div>
        </div>
        
        <div className="flex-1 p-12 flex flex-col justify-center relative mt-6">
          {/* Decorative code grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
               
          <div className="relative z-10 space-y-8 max-w-lg">
            <div className="flex items-center gap-3">
              <Terminal className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold font-mono tracking-tight text-primary">
                {"DevTinder"}
              </h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                {isLogin ? "Welcome back, developer." : "Init your journey."}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Connect with developers who speak your stack. Swipe on talent, match on projects, and build something great together.
              </p>
            </div>
            
            <div className="bg-muted border border-border rounded-lg p-6 font-mono text-sm shadow-sm">
              <div className="flex text-muted-foreground mb-4">
                <span className="text-primary mr-2">~</span>
                <span>./connect.sh --stack=mern --focus=ui</span>
              </div>
              <div className="space-y-2 text-foreground/80">
                <p>{">"} Searching repositories...</p>
                <p>{">"} Analyzing commit history...</p>
                <p className="text-accent">{">"} Match found: 98% compatibility</p>
                <p className="animate-pulse">_</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6">
          <ModeToggle />
        </div>
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Header (Hidden on large screens) */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <Terminal className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold font-mono tracking-tight text-primary">
              {"DevTinder"}
            </h1>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">
              {isLogin ? "Log In" : "Sign Up"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin 
                ? "Enter your credentials to access your account." 
                : "Create an account to start swiping on developers."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-8">
            
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Full Name
                </label>
                <Input
                  className="bg-card font-mono text-sm"
                  placeholder="Linus Torvalds"
                  {...register("firstName", { required: "Name is required" })}
                />
                {errors.firstName && <span className="text-xs text-destructive">{errors.firstName.message}</span>}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                type="email"
                className="bg-card font-mono text-sm"
                placeholder="dev@example.com"
                {...register("emailId", { 
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
                })}
              />
              {errors.emailId && <span className="text-xs text-destructive">{errors.emailId.message}</span>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                {isLogin && (
                  <a href="#" className="text-xs font-medium text-primary hover:underline" onClick={(e) => { e.preventDefault(); toast.info("Check your terminal for the reset link."); }}>
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="bg-card font-mono text-sm pr-10"
                  placeholder="••••••••"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 8, message: "At least 8 characters" }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Confirm Password
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  className="bg-card font-mono text-sm"
                  placeholder="••••••••"
                  {...register("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: value => value === password || "Passwords do not match"
                  })}
                />
                {errors.confirmPassword && <span className="text-xs text-destructive">{errors.confirmPassword.message}</span>}
              </div>
            )}

            <Button type="submit" className="w-full gap-2 text-primary-foreground font-semibold font-mono tracking-wide">
              {isLogin ? "EXECUTE LOGIN" : "INITIALIZE ACCOUNT"} <ArrowRight size={16} />
            </Button>
            
            {/* Removed GitHub login as requested */}
          </form>

          <div className="text-center mt-6">
            <button 
              onClick={toggleMode}
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              {isLogin ? "git checkout -b new-account" : "git checkout main"}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
