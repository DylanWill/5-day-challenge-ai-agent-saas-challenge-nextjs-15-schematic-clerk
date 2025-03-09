import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { encrypt, decrypt } from './encryption';

// Define the scopes we need for Gmail, Drive, Calendar, and Contacts
const SCOPES = [
  // Keep only the basic read-only scope for testing
  'https://www.googleapis.com/auth/gmail.readonly',
  
  // Comment out all other scopes for now - will add back in production
  // 'https://www.googleapis.com/auth/gmail.send',
  // 'https://www.googleapis.com/auth/gmail.compose',
  // 'https://www.googleapis.com/auth/gmail.modify',
  // 'https://www.googleapis.com/auth/drive.file',
  // 'https://www.googleapis.com/auth/calendar',
  // 'https://www.googleapis.com/auth/contacts.readonly'
];

// Create OAuth2 client
export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Google OAuth credentials are not properly configured');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

// Generate authorization URL
export function getAuthUrl() {
  const oauth2Client = getOAuth2Client();
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline', // Get refresh token
    scope: SCOPES,
    prompt: 'consent' // Force consent screen to always get refresh token
  });
}

// Helper function to wait between retries
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Exchange code for tokens with retry logic
export async function getTokensFromCode(code: string) {
  const oauth2Client = getOAuth2Client();
  const maxRetries = 3;
  let retryCount = 0;
  
  // Keep trying until we succeed or run out of retries
  while (retryCount <= maxRetries) {
    try {
      console.log(`Token exchange attempt ${retryCount + 1}/${maxRetries + 1}`);
      
      // Increase timeout substantially for VPN connections from China
      const tokenRequest = oauth2Client.getToken({
        code,
        // Timeout of 60 seconds
        timeout: 60000
      });
      
      console.log('Token request initiated, waiting for response...');
      
      const { tokens } = await tokenRequest;
      
      console.log('Tokens received successfully');
      return tokens;
    } catch (error) {
      console.error(`Error in attempt ${retryCount + 1}:`, error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
      } else if (error.code) {
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
      }
      
      // If we've used all our retries, or if the error isn't a network error, give up
      if (
        retryCount >= maxRetries || 
        (error.code && error.code !== 'ETIMEDOUT' && error.code !== 'ECONNRESET')
      ) {
        throw error;
      }
      
      // Otherwise, wait a bit and retry
      const retryDelay = 2000 * Math.pow(2, retryCount); // Exponential backoff
      console.log(`Retrying in ${retryDelay}ms...`);
      await wait(retryDelay);
      retryCount++;
    }
  }
  
  // This should never be reached because the last failure in the loop will throw
  throw new Error('Failed to exchange authorization code for tokens after multiple attempts');
}

// Store tokens securely in cookies
export function storeTokens(tokens: any) {
  try {
    const cookieStore = cookies();
    
    // Encrypt tokens before storing
    const encryptedTokens = encrypt(JSON.stringify(tokens));
    
    // Store in HTTP-only cookie
    cookieStore.set('google_tokens', encryptedTokens, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });
    
    return true;
  } catch (error) {
    console.error('Error storing tokens:', error);
    return false;
  }
}

// Get tokens from cookies
export function getTokensFromCookies() {
  try {
    const cookieStore = cookies();
    const encryptedTokens = cookieStore.get('google_tokens')?.value;
    
    if (!encryptedTokens) {
      return null;
    }
    
    return JSON.parse(decrypt(encryptedTokens));
  } catch (error) {
    console.error('Error getting tokens from cookies:', error);
    return null;
  }
}

// Refresh tokens if expired
export async function refreshTokensIfNeeded(tokens: any) {
  if (!tokens.expiry_date || Date.now() >= tokens.expiry_date) {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials(tokens);
    
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      storeTokens(credentials);
      return credentials;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
  
  return tokens;
}

// Get authenticated client
export async function getAuthenticatedClient() {
  const tokens = getTokensFromCookies();
  
  if (!tokens) {
    return null;
  }
  
  const refreshedTokens = await refreshTokensIfNeeded(tokens);
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(refreshedTokens);
  
  return oauth2Client;
}

// Check if user is authenticated with Google
export function isGoogleAuthenticated() {
  // Check for mock mode
  if (process.env.USE_MOCK_GOOGLE_AUTH === 'true') {
    console.log('Using mock Google authentication status');
    // In mock mode, we'll consider the user authenticated if they've attempted to connect
    const mockAuthAttempted = typeof window !== 'undefined' && 
      localStorage.getItem('mockGoogleAuthAttempted') === 'true';
    
    if (mockAuthAttempted) {
      console.log('Mock Google authentication: User is authenticated');
      return true;
    }
    
    console.log('Mock Google authentication: User is not authenticated');
    return false;
  }
  
  // Real implementation
  try {
    return getTokensFromCookies() !== null;
  } catch (error) {
    console.error('Error checking Google authentication:', error);
    return false;
  }
}

// Remove tokens (sign out from Google)
export function removeGoogleTokens() {
  try {
    const cookieStore = cookies();
    cookieStore.delete('google_tokens');
    return true;
  } catch (error) {
    console.error('Error removing Google tokens:', error);
    return false;
  }
} 