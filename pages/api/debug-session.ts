import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the session
    const session = await getServerSession(req, res, authOptions);
    
    // Return session details
    res.status(200).json({ 
      hasSession: !!session,
      sessionDetails: session ? {
        userEmail: session.user?.email,
        hasCustomToken: !!session.customToken,
        expiresAt: session.expires
      } : null
    });
  } catch (error) {
    console.error('Session debug error:', error);
    res.status(500).json({ 
      message: 'Error fetching session information',
      error: String(error)
    });
  }
}
