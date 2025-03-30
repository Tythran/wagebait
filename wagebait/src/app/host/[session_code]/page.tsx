import { ErrorBoundary } from 'react-error-boundary';

import styles from './page.module.css';
import Player from './player';
import QuestionDisplay from './questiondisplay';

export default async function Host({ params }: { params: Promise<{ session_code: string }> }) {
  const { session_code } = await params;
  console.log(session_code);

  return (
    <>
      <div className={`${styles.pot}`}>Betting Pool: $2000</div>
      <div className={`${styles.layout}`}>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <QuestionDisplay questionText="What is my name?" questionOptions={['Tyler', 'Sam', 'Dylan', 'Jacq']} />
        </ErrorBoundary>

        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <div className={`${styles.playerContainer}`}>
            <Player name={'Bobbyyyyyyyyyyyy'} avatarSeed={'dfhskjadhfsdkfhlkahsd'} bet={2000} balance={5000} />
            <Player name={'Donna'} avatarSeed={'dfhskjfsdkfhlkahsd'} bet={2000} balance={10000} />
            <Player name={'Sarah'} avatarSeed={'dfhshellokfhlkahsd'} bet={2000} balance={8000} />
            <Player name={'Teddy'} avatarSeed={'dfhsdadlkahsd'} bet={2000} balance={2000} />
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
}
