'use client';

import Buttons from './buttons';

export default function Client({ sessionCode }: { sessionCode: string }) {
  console.log(sessionCode);
  const [playerName, setPlayerName] = useState<string>('');
  const [avatarSeed, setAvatarSeed] = useState<string>('');

  return <Buttons />;
}
