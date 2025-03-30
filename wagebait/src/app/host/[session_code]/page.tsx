import { ErrorBoundary } from 'react-error-boundary';

import { createClient } from '@/utils/supabase/client';

import HostClient from './page.client';
import styles from './page.module.css';
import Player from './player';
import QuestionDisplay from './questiondisplay';

const supabase = createClient();

export default async function Host({ params }: { params: Promise<{ session_code: string }> }) {
  const { session_code } = await params;
  console.log(session_code);

  return <HostClient session_code={session_code} />;
}
