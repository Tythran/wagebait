'use client';

import { signInWithDiscord } from './actions';

export default function Login() {
  return (
    <div className="d-flex flex-column gap-2 justify-content-center align-items-center vh-100">
      <button type="button" className="btn btn-secondary" onClick={signInWithDiscord}>
        Login with Discord
      </button>
    </div>
  );
}
