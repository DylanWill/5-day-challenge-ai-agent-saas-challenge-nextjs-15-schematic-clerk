import crypto from 'crypto';

// Get encryption key from environment or generate one
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 
  'this-is-a-fallback-key-that-is-32chars'; // 32 bytes for AES-256

// Initialization vector length
const IV_LENGTH = 16; // For AES, this is always 16 bytes

/**
 * Encrypt a string using AES-256-CBC
 */
export function encrypt(text: string): string {
  try {
    // Create an initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv(
      'aes-256-cbc', 
      Buffer.from(ENCRYPTION_KEY), 
      iv
    );
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Combine IV and encrypted data
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt a string using AES-256-CBC
 */
export function decrypt(text: string): string {
  try {
    // Split IV and encrypted data
    const parts = text.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    
    // Create decipher
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc', 
      Buffer.from(ENCRYPTION_KEY), 
      iv
    );
    
    // Decrypt the text
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Failed to decrypt data');
  }
} 