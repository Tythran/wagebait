'use client';

import { useEffect, useState } from 'react';

import { createClient } from '@/utils/supabase/client';

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  const signInWithDiscord = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: 'https://yawscsnndnsbxacdqcuz.supabase.co/auth/v1/callback',
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
      if (!error && data?.user) {
        setLoggedIn(true);
        setEmail(data?.user.email ?? 'email not found');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="d-flex flex-column gap-2 justify-content-center align-items-center vh-100">
      {loggedIn ? (
        <>
          <div>
            Logged in as <strong>{email}</strong>
          </div>
          <button type="button" className="btn btn-danger" onClick={signout}>
            Logout
          </button>
        </>
      ) : (
        <button type="button" className="btn btn-primary" onClick={signInWithDiscord}>
          Login with Discord
        </button>
      )}
    </div>
  );
}
