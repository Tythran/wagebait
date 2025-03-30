'use client';

import { redirect } from 'next/navigation';
import type { SyntheticEvent } from 'react';

export default function Join() {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const gameCode = (document.getElementById('gameCode') as HTMLInputElement).value;
    // validation goes here
    redirect(`/play/${gameCode}`);
  };

  return (
    <div className="d-flex flex-column gap-3 justify-content-center align-items-center" style={{ height: '100dvh' }}>
      <h1>Join a wagebait game</h1>
      <form className="d-flex flex-column gap-1 justify-content-center align-items-center">
        <div className="mb-3">
          <input type="text" className="form-control form-control-lg" id="gameCode" placeholder="Enter game code" />
        </div>
        <button type="button" className="btn btn-lg btn-primary" onClick={handleSubmit}>
          <i className="bi bi-play me-2" />
          Play
        </button>
      </form>
    </div>
  );
}
