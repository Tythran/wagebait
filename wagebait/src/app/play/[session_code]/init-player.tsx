'use client';

import { useMemo } from 'react';

import { openPeeps } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

export default function InitPlayer() {
  const avatarSeed = 'test';

  const avatar = useMemo(() => {
    return createAvatar(openPeeps, {
      seed: avatarSeed,
      size: 160,
    }).toDataUri();
  }, [avatarSeed]);

  const img = useMemo(() => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatar} alt="Avatar" />;
  }, [avatar]);

  return <div className="d-flex justify-content-center align-content-center gap-2">{img}</div>;
}
