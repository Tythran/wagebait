import { useMemo } from 'react';

import { openPeeps } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

import style from './player.module.css';

export default function Player({
  name,
  avatarSeed,
  bet,
  balance,
}: {
  name: string;
  avatarSeed?: string;
  bet: number;
  balance: number;
}) {
  avatarSeed = avatarSeed ?? name;

  const avatar = useMemo(() => {
    return createAvatar(openPeeps, {
      seed: avatarSeed,
      size: 160,
    }).toDataUri();
  }, [avatarSeed]);

  const img = useMemo(() => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={style.avatar} src={avatar} alt="Avatar" />;
  }, [avatar]);

  return (
    <div className={style.container}>
      <div className={`${style.bet} text-center`}>
        <span style={{ fontWeight: 500 }}>BET </span>
        <span style={{ fontSize: '1.25rem' }}>${bet}</span>
      </div>
      <div>
        <div className={`${style.name} text-center`}>{name}</div>
        {img}
        <div className={`${style.balance} text-center`}>${balance}</div>
      </div>
    </div>
  );
}
