// Helper functions for authentication
import jwt from 'jsonwebtoken';

// Generate a JWT token for the middleware authentication
export const generateToken = (email: string): string => {
  return jwt.sign(
    { 
      email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12) // 12 hours
    }, 
    process.env.JWT_SECRET || 'default-secret-change-me'
  );
};

// Check if an email is in the allowed list
export const isEmailAllowed = (email: string): boolean => {
  const allowedEmails = (process.env.ALLOWED_EMAILS || '').split(',').map(e => e.trim());
  return allowedEmails.includes(email);
};
