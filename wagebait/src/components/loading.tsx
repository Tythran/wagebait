export default function Loading() {
  return (
    <div className="d-flex flex-column justify-content-center align-content-center" style={{ height: '100%' }}>
      <div className="spinner-border" style={{ margin: 'auto' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
