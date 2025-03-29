import { createClient } from '@/utils/supabase/server';

export async function signInWithDiscord() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
  });
  if (error) {
    console.error('Error signing in with Discord:', error);
    return;
  }
  console.log('Discord sign-in data:', data);
}
