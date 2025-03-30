'use client';

import { useMemo, type Dispatch, type SetStateAction, type SyntheticEvent } from 'react';

import { openPeeps } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { randomString } from '@/components/utils';

export default function InitPlayer({
  sessionCode,
  playerName,
  avatarSeed,
}: {
  sessionCode: string;
  playerName: { get: string | null; set: Dispatch<SetStateAction<string | null>> };
  avatarSeed: { get: string; set: Dispatch<SetStateAction<string>> };
}) {
  const avatar = useMemo(() => {
    return createAvatar(openPeeps, {
      seed: avatarSeed.get,
      size: 240,
    }).toDataUri();
  }, [avatarSeed.get]);

  const img = useMemo(() => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatar} alt="Avatar" style={{ backgroundColor: '#fff3', borderRadius: '10px' }} />;
  }, [avatar]);

  function handleClick(e: SyntheticEvent): void {
    e.preventDefault();
    const name = (document.getElementById('playerName') as HTMLInputElement).value;
    playerName.set(name);
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-content-center gap-5 text-center"
      style={{ height: '100%' }}
    >
      <h1>Joining game {sessionCode}</h1>
      <div className="d-flex flex-column gap-3 justify-content-center align-content-center">
        <div>{img}</div>
        <div>
          <button className="btn btn-secondary" onClick={() => avatarSeed.set(randomString())}>
            <i className="bi bi-shuffle me-2" />
            Randomize avatar
          </button>
        </div>
      </div>
      <div className="d-flex flex-column gap-3 justify-content-center align-content-center">
        <h2>Enter your name</h2>
        <form className="d-flex gap-1 justify-content-center align-items-center">
          <div className="me-3">
            <input type="text" className="form-control form-control-lg" id="playerName" placeholder="Enter name" />
          </div>
          <button type="button" className="btn btn-lg btn-primary" onClick={(e) => handleClick(e)}>
            <i className="bi bi-play me-2" />
            Play
          </button>
        </form>
      </div>
    </div>
  );
}
