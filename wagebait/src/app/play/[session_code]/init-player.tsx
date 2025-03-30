'use client';

import { useMemo, type Dispatch, type SetStateAction } from 'react';

import { openPeeps } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

export default function InitPlayer({
  playerName,
  avatarSeed,
}: {
  playerName: { get: string | null; set: Dispatch<SetStateAction<string | null>> };
  avatarSeed: { get: string; set: Dispatch<SetStateAction<string>> };
}) {
  const avatar = useMemo(() => {
    return createAvatar(openPeeps, {
      seed: avatarSeed.get,
      size: 160,
    }).toDataUri();
  }, [avatarSeed.get]);

  const img = useMemo(() => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatar} alt="Avatar" />;
  }, [avatar]);

  return (
    <div className="d-flex flex-column justify-content-center align-content-center gap-2">
      {img}
      <h1>Join a wagebait game</h1>
      <form className="d-flex flex-column gap-1 justify-content-center align-items-center">
        <div className="mb-3">
          <input type="text" className="form-control form-control-lg" id="gameCode" placeholder="Enter game code" />
        </div>
        <button type="button" className="btn btn-lg btn-primary">
          <i className="bi bi-play-circle me-2" />
          Play
        </button>
      </form>
    </div>
  );
}
