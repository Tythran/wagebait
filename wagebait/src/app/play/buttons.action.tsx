export default function ActionButton({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" className="btn btn-secondary flex-grow-1">
      <span style={{ fontSize: '2rem' }}>{children}</span>
    </button>
  );
}
