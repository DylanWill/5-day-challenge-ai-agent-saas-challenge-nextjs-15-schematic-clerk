import { useState, useEffect } from 'react';
import { Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export default function GoogleAuthButton() {
  const { isAuthenticated, isLoading, error, connectGoogle, disconnectGoogle } = useGoogleAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [connecting, setConnecting] = useState(false);

  // Check if connection was initiated
  useEffect(() => {
    const authInProgress = localStorage.getItem('googleAuthInProgress');
    if (authInProgress === 'true') {
      setConnecting(true);
      // Clear the flag
      localStorage.removeItem('googleAuthInProgress');
    }
  }, []);

  // Check for URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('google_connected') === 'true') {
      setToastMessage('Successfully connected to Google!');
      setToastType('success');
      setShowToast(true);
      setConnecting(false);
      
      // Remove the query parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
    
    if (urlParams.get('error')) {
      setToastMessage(`Error connecting to Google: ${urlParams.get('error')}`);
      setToastType('error');
      setShowToast(true);
      setConnecting(false);
      
      // Remove the query parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Show toast when error changes
  useEffect(() => {
    if (error) {
      setToastMessage(`Error: ${error}`);
      setToastType('error');
      setShowToast(true);
      setConnecting(false);
    }
  }, [error]);

  // Hide toast after 5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Handle connecting to Google
  const handleConnectGoogle = () => {
    setConnecting(true);
    connectGoogle();
  };

  // Show loading state while checking authentication or while connecting
  if (isLoading || connecting) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg flex items-center gap-2"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        {connecting ? "Connecting to Google..." : "Checking Google connection..."}
      </button>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <button
          onClick={disconnectGoogle}
          className="px-4 py-2 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 hover:bg-red-200 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Disconnect Google
        </button>
      ) : (
        <button
          onClick={handleConnectGoogle}
          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Connect Google Account
        </button>
      )}
      
      {/* Toast notification */}
      {showToast && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
            toastType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          } flex items-center gap-2 z-50 max-w-md`}
        >
          {toastType === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="flex-grow">{toastMessage}</span>
          <button
            onClick={() => setShowToast(false)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
} 