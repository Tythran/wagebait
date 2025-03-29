'use client';

import { signInWithDiscord } from './actions';

export default function Home() {
  return (
    <div className="d-flex flex-column gap-2 justify-content-center align-items-center vh-100">
      <div>wagebait</div>

      <div className="d-flex gap-2">
        <button type="button" className="btn btn-primary">
          Join game
        </button>

        <button type="button" className="btn btn-secondary" onClick={signInWithDiscord}>
          Login with Discord
        </button>
      </div>
    </div>
  );
}
