'use client';

import { useEffect, useState } from 'react';

import { randomString } from '@/components/utils';
import { createClient } from '@/utils/supabase/client';

import Buttons from './buttons';
import InitPlayer from './init-player';

export default function Client({ sessionCode }: { sessionCode: string }) {
  const supabase = createClient();

  const activeGamesChannel = supabase.channel('active-games-channel');
  activeGamesChannel
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'active_games', filter: `session_code=${sessionCode}` },
      (payload) => console.log('Change received!', payload)
    )
    .subscribe();

  const [playerID, setPlayerID] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [avatarSeed, setAvatarSeed] = useState<string>(randomString());
  const [bet, setBet] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!playerID) return;
    const handleBeforeUnload = async () => {
      const { error } = await supabase.from('active_players').delete().eq('player_id', playerID);
      if (error) console.error(error);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [playerID, supabase]);

  if (!playerName || !playerID) {
    return (
      <InitPlayer
        sessionCode={sessionCode}
        playerID={{ get: playerID, set: setPlayerID }}
        playerName={{ get: playerName, set: setPlayerName }}
        avatarSeed={{ get: avatarSeed, set: setAvatarSeed }}
        bet={{ get: bet, set: setBet }}
        balance={{ get: balance, set: setBalance }}
      />
    );
  }

  return (
    <Buttons
      playerID={playerID}
      name={playerName}
      bet={{ get: bet, set: setBet }}
      balance={{ get: balance, set: setBalance }}
    />
  );
}
