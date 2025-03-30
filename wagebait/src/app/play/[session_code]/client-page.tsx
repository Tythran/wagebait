'use client';

import { useState } from 'react';

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
      (payload) => {
        console.log('Change received!', payload);
      }
    )
    .subscribe();

  const [playerName, setPlayerName] = useState<string | null>(null);
  const [avatarSeed, setAvatarSeed] = useState<string>(randomString());

  if (!playerName) {
    return (
      <InitPlayer
        sessionCode={sessionCode}
        playerName={{ get: playerName, set: setPlayerName }}
        avatarSeed={{ get: avatarSeed, set: setAvatarSeed }}
      />
    );
  }

  return <Buttons name={playerName} />;
}
