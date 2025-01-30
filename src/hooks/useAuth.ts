import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    isLoading: true,
  });

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data?.role === 'admin';
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      return false;
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const isAdmin = await checkAdminStatus(session.user.id);
          setAuthState({
            user: session.user,
            isAdmin,
            isLoading: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error in setupAuth:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const isAdmin = await checkAdminStatus(session.user.id);
        setAuthState({
          user: session.user,
          isAdmin,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAdmin: false,
          isLoading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return authState;
};