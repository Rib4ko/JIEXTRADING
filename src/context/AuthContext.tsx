
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

type UserRole = 'client' | 'seller' | 'admin';

interface UserInfo {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: UserInfo | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  refreshUserRole: async () => {},
});

/**
 * Fetch user role from Supabase user_roles table, fallback to "client"
 */
async function fetchUserRole(userId: string): Promise<UserRole> {
  console.log('Fetching role for user ID:', userId);
  
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  console.log('Role query result:', { data, error });

  if (error) {
    console.error('Error fetching user role:', error);
    return "client";
  }

  if (!data || data.length === 0) {
    console.log('No role found, defaulting to client');
    return "client";
  }

  // If user has multiple roles, prioritize admin > seller > client
  const roles = data.map(r => r.role);
  console.log('User roles found:', roles);
  
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('seller')) return 'seller';
  return 'client';
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserInfo = async (sessionUser: SupabaseUser) => {
    console.log('Updating user info for:', sessionUser.email);
    const role = await fetchUserRole(sessionUser.id);
    const name = sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'User';
    
    const userInfo = {
      id: sessionUser.id,
      email: sessionUser.email ?? "",
      name: name,
      role,
    };
    
    console.log('Setting user info:', userInfo);
    setUser(userInfo);
  };

  const refreshUserRole = async () => {
    if (session?.user) {
      console.log('Refreshing user role...');
      await updateUserInfo(session.user);
      toast({ title: "Role refreshed", description: "User role has been updated", variant: "default" });
    }
  };

  // Handle auth state and fetch role
  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed, event:", event, "session exists:", !!session);
      setSession(session);
      
      if (session?.user) {
        console.log('User session found, updating user info...');
        await updateUserInfo(session.user);
      } else {
        console.log('No session, clearing user');
        setUser(null);
      }
      
      setLoading(false);
    });

    // THEN check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check, session exists:", !!session);
      setSession(session);
      
      if (session?.user) {
        console.log('Initial session user found, updating user info...');
        await updateUserInfo(session.user);
      } else {
        console.log('No initial session, clearing user');
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    console.log('Attempting login for:', email);
    
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error || !data.session?.user) {
      console.error('Login failed:', error);
      toast({ title: "Login failed", description: error?.message || "Invalid credentials.", variant: "destructive" });
      setLoading(false);
      return false;
    }
    
    console.log('Login successful for user:', data.session.user.email);
    toast({ title: "Login successful", variant: "default" });
    setLoading(false);
    return true;
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error || !data.user) {
      toast({ title: "Registration failed", description: error?.message || "Unable to register.", variant: "destructive" });
      setLoading(false);
      return false;
    }
    toast({ title: "Registration successful", description: "You are now logged in!", variant: "default" });
    setLoading(false);
    return true;
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear our application state first
      setUser(null);
      setSession(null);
      
      // Then attempt to sign out from Supabase
      await supabase.auth.signOut();
      
      // Force hard navigation to login page to ensure complete reset
      setTimeout(() => {
        window.location.replace("/login");
      }, 100);
      
      toast({ title: "Logged out successfully", variant: "default" });
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: "Logout failed", description: "Please try again", variant: "destructive" });
      
      // Even if there's an error, redirect to login
      setTimeout(() => {
        window.location.replace("/login");
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isAuthenticated: !!user, 
      login, 
      register, 
      logout,
      refreshUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
