import { createClient } from '@/utils/supabase/server';

import Back from './back';
import Client from './client-page';

export default async function Play({ params }: { params: Promise<{ session_code: string }> }) {
  const { session_code } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase.from('active_games').select().eq('session_code', session_code).maybeSingle();

  if (error) console.error(error);

  if (!data) return <Back text="Game not found" />;

  return <Client sessionCode={session_code} />;
}
