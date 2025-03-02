import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Return environment variables (only in development)
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'Only available in development mode' });
  }

  res.status(200).json({
    nextAuthUrl: process.env.NEXTAUTH_URL || 'Not set',
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasJwtSecret: !!process.env.JWT_SECRET,
    allowedEmails: process.env.ALLOWED_EMAILS || 'Not set',
    webuiUrl: process.env.NEXT_PUBLIC_WEBUI_URL || 'Not set',
    nodeEnv: process.env.NODE_ENV
  });
}
