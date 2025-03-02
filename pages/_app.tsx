import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import { useEffect } from 'react';
import { checkRequiredEnvVars } from '../lib/check-env';

// Run env check in development
if (process.env.NODE_ENV === 'development') {
  try {
    checkRequiredEnvVars();
  } catch (error) {
    console.error('Environment check failed:', error);
  }
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // Log some useful debug info
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('App initialization - Environment:', process.env.NODE_ENV);
      console.log('App initialization - NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
      console.log('App initialization - Public URL:', process.env.NEXT_PUBLIC_WEBUI_URL);
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;