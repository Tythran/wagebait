import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';

function App() {
  const avatar = useMemo(() => {
    return createAvatar(openPeeps, {
      seed: 'player',
      size: 128
    }).toDataUri();
  }, []);

  return <img src={avatar} alt="Avatar" />;
}

export default App;
