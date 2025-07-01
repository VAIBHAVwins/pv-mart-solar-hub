import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Simplified Firebase user interface
interface FirebaseUser {
  uid: string;
  email: string | null;
}

interface AuthContextType {
  user: User | FirebaseUser | null;
  session: Session | null;
  loading: boolean;
  authType: 'firebase' | 'supabase' | null;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  createFirebaseUser: (email: string, password: string, name: string, phone: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | FirebaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authType, setAuthType] = useState<'firebase' | 'supabase' | null>(null);

  useEffect(() => {
    // Check for Firebase user in localStorage (simplified approach)
    const firebaseUser = localStorage.getItem('firebaseUser');
    if (firebaseUser) {
      try {
        const parsedUser = JSON.parse(firebaseUser);
        setUser(parsedUser);
        setAuthType('firebase');
        setLoading(false);
      } catch (error) {
        console.error('Error parsing Firebase user:', error);
        localStorage.removeItem('firebaseUser');
      }
    }

    // Set up Supabase auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setSession(session);
          setAuthType('supabase');
          setLoading(false);
        } else if (!firebaseUser) {
          setLoading(false);
        }
      }
    );

    // Check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        setAuthType('supabase');
      }
      if (!firebaseUser) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const createFirebaseUser = async (email: string, password: string, name: string, phone: string) => {
    try {
      // Simplified Firebase user creation - store in localStorage
      const firebaseUser: FirebaseUser = {
        uid: `firebase_${Date.now()}`,
        email: email
      };
      
      localStorage.setItem('firebaseUser', JSON.stringify(firebaseUser));
      setUser(firebaseUser);
      setAuthType('firebase');
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    // Try Supabase first
    const { error: supabaseError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!supabaseError) {
      return { error: null };
    }

    // If Supabase fails, check for Firebase user (simplified)
    const firebaseUser = localStorage.getItem('firebaseUser');
    if (firebaseUser) {
      try {
        const parsedUser = JSON.parse(firebaseUser);
        if (parsedUser.email === email) {
          setUser(parsedUser);
          setAuthType('firebase');
          return { error: null };
        }
      } catch (error) {
        console.error('Error parsing Firebase user:', error);
      }
    }

    return { error: supabaseError };
  };

  const signOut = async () => {
    if (authType === 'firebase') {
      localStorage.removeItem('firebaseUser');
      setUser(null);
      setAuthType(null);
    } else {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setAuthType(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      authType,
      signUp,
      signIn,
      signOut,
      createFirebaseUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 