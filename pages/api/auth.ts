import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if email is in allowed list
    const allowedEmails = process.env.ALLOWED_EMAILS?.split(',').map(e => e.trim()) || [];
    
    if (!allowedEmails.includes(email)) {
      return res.status(403).json({ 
        message: 'Access denied. Your email is not authorized for this application.' 
      });
    }

    // Create a token valid for 12 hours
    const token = jwt.sign(
      { 
        email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12) // 12 hours
      }, 
      process.env.JWT_SECRET || 'default-secret-change-me'
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
}
