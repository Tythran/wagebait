import Link from 'next/link';

export default function Back({ text }: { text: string }) {
  return (
    <div
      className="d-flex flex-column gap-2 justify-content-center align-content-center text-center"
      style={{ height: '100%' }}
    >
      <div>{text}</div>
      <div>
        <Link href="/join">
          <button type="button" className="btn btn-primary">
            Back
          </button>
        </Link>
      </div>
    </div>
  );
}
