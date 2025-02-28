import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from "next-auth/react";
import Head from 'next/head';

// Extend the Session type to include our custom token
declare module "next-auth" {
  interface Session {
    customToken?: string;
  }
}

const Home = () => {
  const { data: session, status } = useSession();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle sign in error from NextAuth
  useEffect(() => {
    if (router.query.error) {
      if (router.query.error === 'AccessDenied') {
        setError('Access denied. Your email is not authorized for this application.');
      } else {
        setError('An error occurred during sign in. Please try again.');
      }
    }
  }, [router.query.error]);

  // Handle redirection after successful authentication
  useEffect(() => {
    const redirectAuthenticated = async () => {
      if (session && status === "authenticated") {
        setLoading(true);

        try {
          // Get the token from our API endpoint
          const response = await fetch('/api/auth-token');
          
          if (!response.ok) {
            const data = await response.json();
            setError(data.message || 'Failed to get authentication token');
            setLoading(false);
            return;
          }
          
          const { token } = await response.json();
          
          // Redirect to the WebUI with token
          const redirectUrl = `${process.env.NEXT_PUBLIC_WEBUI_URL}?token=${token}`;
          window.location.href = redirectUrl;
        } catch (err) {
          console.error('Error redirecting:', err);
          setError('Failed to redirect to the rendering application');
          setLoading(false);
        }
      }
    };

    redirectAuthenticated();
  }, [session, status]);

  // Handle Google Sign In
  const handleSignIn = async () => {
    setError('');
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Architectural Rendering - Login</title>
      </Head>

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Architectural Rendering</h1>
          <p className="text-gray-600">Sign in to access your rendering tools</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Authenticating your access...</p>
          </div>
        ) : status === "authenticated" ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">Signed in as {session.user?.email}</p>
            <p className="text-gray-600 mb-4">Redirecting to rendering application...</p>
            <button
              onClick={() => signOut()}
              className="text-blue-500 hover:text-blue-700"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-3 w-full hover:shadow-lg transition-all"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              className="w-6 h-6 mr-2" 
            />
            <span className="text-gray-700 font-medium">Sign in with Google</span>
          </button>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Access is restricted to authorized users only.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
