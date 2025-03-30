import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';

function App() {
  const seed = 'player2';
  const avatar = useMemo(() => {
    return createAvatar(bottts, {
      seed: seed,
      size: 200
    }).toDataUri();
  }, [seed]);

  return <>
  <p>
    {seed}
  </p>
  <img src={avatar} alt="Avatar"/>;
  </>
}

export default App;
