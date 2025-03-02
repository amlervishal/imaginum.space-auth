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
  const [authToken, setAuthToken] = useState('');
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

  // Handle getting token after successful authentication
  useEffect(() => {
    const getAuthToken = async () => {
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
          setAuthToken(token);
          setLoading(false);
        } catch (err) {
          console.error('Error getting token:', err);
          setError('Failed to get authentication token');
          setLoading(false);
        }
      }
    };

    getAuthToken();
  }, [session, status]);

  // Handle Google Sign In
  const handleSignIn = async () => {
    setError('');
    try {
      // Sign in with Google, explicitly specifying localhost callback
      await signIn('google', { 
        callbackUrl: 'http://localhost:3000',
        redirect: true 
      });
    } catch (err) {
      console.error("Sign in error:", err);
      setError('Failed to start sign in process');
    }
  };

  // Handle app launch
  const launchStableDiffusion = () => {
    if (!authToken) return;
    // Launch stable diffusion with token in a new window
    window.open(`${process.env.NEXT_PUBLIC_WEBUI_URL}?token=${authToken}`, '_blank');
  };

  const launchPromptGenerator = () => {
    // Launch the prompt generator in a new window
    window.open('https://imaginaire.vercel.app/', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF0ED' }}>
      <Head>
        <title>imaginum.space - Login</title>
      </Head>

      <main className="flex-1 flex flex-col pt-8 px-4 pb-0">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-2 tracking-[-0.05em] text-[#543d27]">
              imaginum.space
            </h1>
            <p className="text-sm text-[#543d27]/70">
              Your powerful AI image generation platform
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="neumorphic p-6" style={{
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '20px 20px 60px rgba(0, 0, 0, 0.05), -20px -20px 60px rgba(255, 255, 255, 0.8)'
            }}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-[#543d27]/70">Authenticating your access...</p>
                </div>
              ) : status === "authenticated" && session ? (
                <div className="text-center py-4">
                  <p className="text-[#543d27] mb-6">Signed in as {session.user?.email}</p>
                  
                  <div className="space-y-4 mb-8">
                    <button
                      onClick={launchStableDiffusion}
                      className="w-full py-6 font-medium text-[#543d27] neumorphic-button"
                      style={{ background: '#fac9b8' }}
                    >
                      Launch Stable Diffusion
                    </button>
                    
                    <button
                      onClick={launchPromptGenerator}
                      className="w-full py-6 font-medium text-[#543d27] neumorphic-button"
                      style={{ background: '#fac9b8' }}
                    >
                      Launch Prompt Generator
                    </button>
                  </div>
                  
                  <button
                    onClick={() => signOut({ callbackUrl: 'http://localhost:3000' })}
                    className="text-[#543d27]/70 hover:text-[#543d27]"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-[#543d27]/70 mb-6">Please sign in to access your tools</p>
                  
                  <button
                    onClick={handleSignIn}
                    className="flex items-center justify-center bg-white border border-gray-300 rounded-lg neumorphic-button px-6 py-3 w-full"
                  >
                    <img 
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                      alt="Google logo" 
                      className="w-6 h-6 mr-2" 
                    />
                    <span className="text-[#543d27] font-medium">Sign in with Google</span>
                  </button>
                  
                  <p className="mt-6 text-center text-sm text-[#543d27]/50">
                    Access is restricted to authorized users only
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-[#543d27]/50 text-sm">
        © 2025 imaginum.space
      </footer>
    </div>
  );
};

export default Home;