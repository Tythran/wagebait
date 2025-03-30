export default function AnswerButton({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <button type="button" className={`btn btn-${color} flex-grow-1`}>
      <span style={{ fontSize: '5em', lineHeight: '2em' }}>{children}</span>
    </button>
  );
}
