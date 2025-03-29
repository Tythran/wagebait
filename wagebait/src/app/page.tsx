'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="d-flex flex-column gap-2 justify-content-center align-items-center vh-100">
      <div>wagebait</div>

      <div className="d-flex gap-2">
        <button type="button" className="btn btn-primary">
          Join game
        </button>

        <Link href={'/login'}>
          <button type="button" className="btn btn-secondary">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}
