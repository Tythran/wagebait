export default function AnswerButton({
  color,
  onClick,
  children,
}: {
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={`btn btn-${color} flex-grow-1`} onClick={onClick}>
      <span style={{ fontSize: '5em', lineHeight: '2em' }}>{children}</span>
    </button>
  );
}
