import HostClient from './page.client';

export default async function Host({ params }: { params: Promise<{ session_code: string }> }) {
  const { session_code } = await params;
  console.log(session_code);

  return <HostClient session_code={session_code} />;
}
