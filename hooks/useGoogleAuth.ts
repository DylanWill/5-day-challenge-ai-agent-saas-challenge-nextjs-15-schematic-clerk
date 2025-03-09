import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface GoogleAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useGoogleAuth() {
  const { isLoaded: isClerkLoaded, userId } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<GoogleAuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function checkGoogleAuth() {
      if (!userId) {
        setState({
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return;
      }
      
      try {
        // Check if user is authenticated with Google
        const response = await fetch('/api/auth/google/status');
        
        // Handle non-OK responses without throwing
        if (!response.ok) {
          console.warn(`Google auth status check returned ${response.status}`);
          setState({
            isAuthenticated: false,
            isLoading: false,
            error: `Failed to check Google authentication status: ${response.status}`,
          });
          return;
        }
        
        const data = await response.json();
        
        setState({
          isAuthenticated: !!data.isAuthenticated,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error checking Google authentication status:', error);
        setState({
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to check Google authentication status',
        });
      }
    }

    if (isClerkLoaded) {
      checkGoogleAuth();
    }
  }, [isClerkLoaded, userId]);

  const connectGoogle = () => {
    // Clear any existing errors
    setState(prev => ({
      ...prev,
      error: null,
    }));
    
    // Show loading state
    setState(prev => ({
      ...prev,
      isLoading: true,
    }));
    
    // Use more reliable direct window location approach
    // This will ensure the browser fully navigates to the auth URL
    try {
      // Track that we're initiating Google auth
      localStorage.setItem('googleAuthInProgress', 'true');
      
      // Redirect to Google OAuth flow
      window.location.href = '/api/auth/google';
    } catch (error) {
      console.error('Error initiating Google auth:', error);
      
      // Restore state on error
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initiate Google authentication',
      }));
    }
  };

  const disconnectGoogle = async () => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
      }));
      
      const response = await fetch('/api/auth/google/disconnect', { method: 'POST' });
      
      if (!response.ok) {
        throw new Error(`Failed to disconnect from Google: ${response.status}`);
      }
      
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error disconnecting from Google:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to disconnect from Google',
      }));
    }
  };

  return {
    ...state,
    connectGoogle,
    disconnectGoogle,
  };
} 