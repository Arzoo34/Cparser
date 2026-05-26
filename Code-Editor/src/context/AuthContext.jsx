import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
        });
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.message || 'An error occurred during login' };
    }
  };

  const sendOTP = async (email) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to send OTP' };
    }
  };

  const verifyOTP = async (email, token, name, password) => {
    try {
      // Verify the OTP
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (verifyError) {
        return { success: false, error: verifyError.message };
      }

      if (!verifyData?.user) {
        return { success: false, error: 'OTP verification failed' };
      }

      // If user was just created, update metadata and set password
      if (verifyData.user && verifyData.session) {
        // Update user metadata with name
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { name: name },
        });

        if (metadataError) {
          console.error('Error updating metadata:', metadataError);
        }

        // Set password for the user
        const { error: passwordError } = await supabase.auth.updateUser({
          password: password,
        });

        if (passwordError) {
          // Password might already be set, that's okay
          console.log('Password update note:', passwordError.message);
        }

        // Set user in context
        setUser({
          id: verifyData.user.id,
          email: verifyData.user.email,
          name: name,
        });

        return { success: true };
      }

      return { success: false, error: 'OTP verification failed' };
    } catch (error) {
      return { success: false, error: error.message || 'OTP verification failed' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        // Check if email confirmation is required
        if (data.user && !data.session) {
          // User created but needs email confirmation
          return {
            success: true,
            requiresConfirmation: true
          };
        }

        // User is automatically logged in (if email confirmation is disabled)
        if (data.session) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || name,
          });
        }
        return { success: true, requiresConfirmation: false };
      }

      return { success: false, error: 'Signup failed' };
    } catch (error) {
      return { success: false, error: error.message || 'An error occurred during signup' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, sendOTP, verifyOTP, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
