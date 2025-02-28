# Architectural Rendering Authentication App

This is a Next.js application that handles authentication for the Architectural Rendering project. It uses NextAuth.js for Google Sign-In and restricts access to specific authorized email addresses.

## Getting Started

1. Copy `.env.local.example` to `.env.local` and fill in the variables:
   ```
   cp .env.local.example .env.local
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to see the result.

## Configuration

You'll need to set up these environment variables:

- `NEXTAUTH_URL`: The full URL of your authentication app
- `NEXTAUTH_SECRET`: A random string for session encryption
- `GOOGLE_CLIENT_ID`: Get from Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: Get from Google Cloud Console
- `JWT_SECRET`: A random string for JWT signing
- `ALLOWED_EMAILS`: Comma-separated list of authorized Gmail addresses
- `NEXT_PUBLIC_WEBUI_URL`: URL to your Stable Diffusion WebUI via Cloudflare Tunnel

## Setting Up Google Authentication

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Set the application type to "Web application"
6. Add your app URL to authorized JavaScript origins
7. Add `https://your-domain.com/api/auth/callback/google` to authorized redirect URIs
8. Copy the Client ID and Client Secret to your .env.local file

## Deployment to Vercel

1. Push this repository to GitHub.

2. Connect your GitHub repository to Vercel.

3. Set up environment variables in the Vercel dashboard.

4. Deploy.

## Custom Domain Setup

Vercel's free tier supports custom domains. To set up your custom domain:

1. Go to your project settings in the Vercel dashboard.
2. Navigate to "Domains".
3. Add your custom domain.
4. Follow the instructions to configure your DNS settings.

## How It Works

1. User visits the application and signs in with Google via NextAuth.js
2. The app checks if the user's email is in the allowed list
3. If authorized, the user receives a JWT token
4. The user is redirected to the Stable Diffusion WebUI with the token
5. The middleware on your Mac Mini validates the token before granting access
