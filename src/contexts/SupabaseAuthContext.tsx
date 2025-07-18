
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string | null;
  signUp: (email: string, password: string, options?: { data?: any; options?: any }) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role with delay to allow trigger to complete
          setTimeout(async () => {
            try {
              const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (userData) {
                setUserRole(userData.role);
                localStorage.setItem('userRole', userData.role);
              }
            } catch (error) {
              console.error('Error fetching user role:', error);
            }
          }, 1000); // Give time for the trigger to complete
        } else {
          setUserRole(null);
          localStorage.removeItem('userRole');
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Get user role from localStorage for immediate access
        const cachedRole = localStorage.getItem('userRole');
        if (cachedRole) {
          setUserRole(cachedRole);
        }
        
        // Also fetch from database
        setTimeout(async () => {
          try {
            const { data: userData } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (userData) {
              setUserRole(userData.role);
              localStorage.setItem('userRole', userData.role);
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
          }
        }, 500);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, options?: { data?: any; options?: any }) => {
    const redirectUrl = options?.options?.emailRedirectTo || `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: options?.data
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { error };
  };

  return (
    <SupabaseAuthContext.Provider value={{
      user,
      session,
      loading,
      userRole,
      signUp,
      signIn,
      signOut,
      resetPassword
    }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
