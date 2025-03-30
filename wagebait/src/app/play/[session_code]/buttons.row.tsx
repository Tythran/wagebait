export default function ButtonRow({
  flexGrow,
  className,
  children,
}: {
  flexGrow: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`d-flex gap-3 ${className ?? ''}`} style={{ flexGrow: flexGrow }}>
      {children}
    </div>
  );
}
