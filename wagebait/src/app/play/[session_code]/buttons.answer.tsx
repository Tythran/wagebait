export default function AnswerButton({
  color,
  onClick,
  children,
  disabled,
}: {
  color: string;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button type="button" className={`btn btn-${color} flex-grow-1`} onClick={onClick} disabled={disabled}>
      <span style={{ fontSize: '5em', lineHeight: '2em' }}>{children}</span>
    </button>
  );
}
