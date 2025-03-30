'use client';

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction, type SyntheticEvent } from 'react';

import { openPeeps } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { randomString } from '@/components/utils';
import { createClient } from '@/utils/supabase/client';
import Loading from '@/components/loading';
import Back from './back';

export default function InitPlayer({
  sessionCode,
  playerName,
  avatarSeed,
}: {
  sessionCode: string;
  playerName: { get: string | null; set: Dispatch<SetStateAction<string | null>> };
  avatarSeed: { get: string; set: Dispatch<SetStateAction<string>> };
}) {
  const supabase = createClient();

  const [tempPlayerName, setTempPlayerName] = useState<string>('');
  const [nextVacantPlayer, setNextVacantPlayer] = useState<number | null>(null);

  useEffect(() => {
    const getNextVacantPlayer = async () => {
      const { data, error } = await supabase
        .from('active_players')
        .select('player_number')
        .eq('session_code', sessionCode);
      if (error) {
        console.error(error);
      } else {
        const playerNumbers = data.map((player) => player.player_number);
        // find any gap in the player numbers
        let nextVacantPlayer = [...Array(5).keys()].find((i) => !playerNumbers.includes(i + 1)) ?? null;
        if (nextVacantPlayer !== null) nextVacantPlayer++;
        console.log('Next vacant player:', nextVacantPlayer);
        setNextVacantPlayer(nextVacantPlayer);
      }
    };
    getNextVacantPlayer();
  }, [sessionCode, supabase]);

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

  if (nextVacantPlayer === null) return <Loading />;

  if (nextVacantPlayer > 4) return <Back text="Game is full" />;

  async function handleClick(e: SyntheticEvent): Promise<void> {
    e.preventDefault();
    playerName.set(tempPlayerName);
    const { data, error } = await supabase
      .from('active_players')
      .insert([
        {
          player_name: tempPlayerName,
          session_code: sessionCode,
          avatar_seed: avatarSeed.get,
          bet: 0,
          balance: 1000,
          player_number: nextVacantPlayer,
        },
      ])
      .select();
    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
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
            <input
              type="text"
              className="form-control form-control-lg"
              id="playerName"
              placeholder="Enter name"
              onChange={(e) => setTempPlayerName(e.currentTarget.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-lg btn-primary"
            onClick={(e) => handleClick(e)}
            disabled={tempPlayerName === '' || nextVacantPlayer === null}
          >
            <i className="bi bi-play me-2" />
            Play
          </button>
        </form>
      </div>
    </div>
  );
}
