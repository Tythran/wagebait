'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="d-flex flex-column gap-2 justify-content-center align-items-center vh-100">
      <p className="h1">wagebait</p>

      <div className="d-flex gap-2">
        <Link href={'/join'}>
          <button type="button" className="btn btn-primary">
            Join game
          </button>
        </Link>

        <Link href={'/login'}>
          <button type="button" className="btn btn-secondary bg-gradient button-font">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}
