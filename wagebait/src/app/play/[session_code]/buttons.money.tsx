export default function Money({ name, amount }: { name: string; amount: number }) {
  return (
    <div className="d-flex flex-column col" style={{ height: '100%' }}>
      <span>
        <strong>{name}</strong>
      </span>
      <span style={{ fontSize: '2rem', fontWeight: '300' }}>${amount}</span>
    </div>
  );
}
