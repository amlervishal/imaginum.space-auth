// This file is executed during startup to ensure all required environment variables are set

export function checkRequiredEnvVars() {
  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'JWT_SECRET',
    'ALLOWED_EMAILS',
    'NEXT_PUBLIC_WEBUI_URL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ ERROR: Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`  - ${varName}`);
    });
    console.error('\nPlease set these variables in your .env.local file');
    
    // In development, we'll just log errors
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  } else {
    console.log('✅ All required environment variables are set');
  }
}

// Export environment variables with defaults for safety
export const env = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  ALLOWED_EMAILS: (process.env.ALLOWED_EMAILS || '').split(',').map(email => email.trim()),
  NEXT_PUBLIC_WEBUI_URL: process.env.NEXT_PUBLIC_WEBUI_URL || '',
  // Add other environment variables as needed
};