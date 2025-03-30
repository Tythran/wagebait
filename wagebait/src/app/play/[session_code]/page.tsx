import Client from './client-page';

export default async function Play({ params }: { params: Promise<{ session_code: string }> }) {
  const { session_code } = await params;
  return <Client sessionCode={session_code} />;
}
