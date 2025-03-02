import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

// Allowed email addresses from environment variable
const allowedEmails = (process.env.ALLOWED_EMAILS || "").split(",").map(email => email.trim());

// Force NEXTAUTH_URL to be localhost for local development
const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      // Check if the user's email is in the allowed list
      if (user.email && allowedEmails.includes(user.email)) {
        return true;
      }
      // Return false if the email is not allowed
      return false;
    },
    async jwt({ token, account }) {
      // Add auth_time when the token is first created
      if (account) {
        token.auth_time = Math.floor(Date.now() / 1000);
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom properties to the session
      if (session.user && token.sub) {
        // Add the user ID from the token
        session.user.id = token.sub;
        
        // Generate a custom JWT for our middleware
        const customToken = jwt.sign(
          { 
            email: session.user.email,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12) // 12 hours
          }, 
          process.env.JWT_SECRET || "default-secret-change-me"
        );
        session.customToken = customToken;
      }
      return session;
    },
    // Critical: Make sure the redirect is always to the correct URL
    async redirect({ url, baseUrl }) {
      // Log for debugging
      console.log('Redirect called:', { url, baseUrl });
      
      // Always redirect to localhost in development
      if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3000';
      }
      
      // For production, use the configured base URL
      return baseUrl;
    }
  },
  pages: {
    signIn: "/", // Custom sign-in page
    error: "/" // Custom error page
  },
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  
  // Override URLs
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? `__Secure-next-auth.session-token` 
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  }
};

export default NextAuth(authOptions);