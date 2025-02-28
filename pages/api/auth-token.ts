import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import jwt from 'jsonwebtoken';

// Allowed email addresses from environment variable
const allowedEmails = (process.env.ALLOWED_EMAILS || "").split(",").map(email => email.trim());

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the session
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated
    if (!session || !session.user?.email) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Check if the email is in the allowed list
    if (!allowedEmails.includes(session.user.email)) {
      return res.status(403).json({ 
        message: 'Access denied. Your email is not authorized for this application.' 
      });
    }

    // Return the custom token from the session
    if (session.customToken) {
      return res.status(200).json({ token: session.customToken });
    }

    // If no custom token exists (shouldn't happen), create one
    const token = jwt.sign(
      { 
        email: session.user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12) // 12 hours
      }, 
      process.env.JWT_SECRET || "default-secret-change-me"
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
}
