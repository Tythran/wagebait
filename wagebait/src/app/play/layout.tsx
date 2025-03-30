export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="d-flex justify-content-center align-items-stretch" style={{ height: '100dvh' }}>
      <div className="p-3" style={{ width: '540px' }}>
        {children}
      </div>
    </div>
  );
}
