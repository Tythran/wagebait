'use client';

import { useState } from 'react';

import { randomString } from '@/components/utils';

import Buttons from './buttons';
import InitPlayer from './init-player';

export default function Client({ sessionCode }: { sessionCode: string }) {
  console.log(sessionCode);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [avatarSeed, setAvatarSeed] = useState<string>(randomString());

  if (!playerName) {
    return (
      <InitPlayer
        playerName={{ get: playerName, set: setPlayerName }}
        avatarSeed={{ get: avatarSeed, set: setAvatarSeed }}
      />
    );
  }

  return <Buttons />;
}
