import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: any | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        setAuthState({
          user: session.user,
          isAdmin: roleData?.role === 'admin',
          isLoading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        setAuthState({
          user: session.user,
          isAdmin: roleData?.role === 'admin',
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