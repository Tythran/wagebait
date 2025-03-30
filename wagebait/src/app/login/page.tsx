'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { createClient } from '@/utils/supabase/client';

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  const signInWithDiscord = async () => {
    const getURL = () => {
      let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:3000/';
      // Make sure to include `https://` when not localhost.
      url = url.startsWith('http') ? url : `https://${url}`;
      // Make sure to include a trailing `/`.
      url = url.endsWith('/') ? url : `${url}/`;
      return url;
    };

    console.log('Signing in with Discord...');
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: getURL() + 'edit',
      },
    });
    if (error) {
      console.error('Error signing in with Discord:', error);
    }
    console.log('Sign in data:', data);
  };

  const signout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      }
      if (data?.user) {
        setLoggedIn(true);
        setEmail(data?.user.email ?? 'email not found');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="d-flex flex-column gap-2 justify-content-center align-items-center vh-100">
      <p className="h1">wagebait</p>
      {loggedIn ? (
        <>
          <div>
            Logged in as <strong>{email}</strong>
          </div>
          <div className="d-flex gap-2">
            <Link href="/edit" className="btn btn-primary bg-gradient button-font">
              Edit games
            </Link>
            <button type="button" className="btn btn-danger bg-gradient button-font" onClick={signout}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <button type="button" className="btn btn-primary bg-gradient button-font" onClick={signInWithDiscord}>
          Login with Discord
        </button>
        
      )}
    </div>
  );
}
