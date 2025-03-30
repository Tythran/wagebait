import { ErrorBoundary } from 'react-error-boundary';

import styles from './page.module.css';
import Player from './player';
import QuestionDisplay from './questiondisplay';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();

export default async function Host({ params }: { params: Promise<{ session_code: string }> }) {
  const { session_code } = await params;
  console.log(session_code);

  // Fetch players from the database
  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('session_code', session_code);
    if (error) {
      console.error('Error fetching players:', error);
    }
    return data || [];
  };
  const players = await fetchPlayers();
  const fetchCurrentGame = async () => {
    const { data, error } = await supabase
      .from('active_games')
      .select('*')
      .eq('session_code', session_code)
      .single();
    if (error) {
      console.error('Error fetching current game:', error);
    }
    return data || null;
  }


  const currentGame = await fetchCurrentGame();
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('category').select('*')
      .eq('game_id', currentGame?.game_id);
    if (error) {
      console.error('Error fetching categories:', error);
    }
    return data || null;
};
  const categories = await fetchCategories();
  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('question').select('*')
      .in('category_id', categories?.map((category) => category.id) || [])
    if (error) {
      console.error('Error fetching questions:', error);
    }
    return data || null;
  };
  const questions = await fetchQuestions();
  console.log(questions);

  return (
    <>
      <div className={`${styles.pot}`}>Betting Pool: {currentGame?.betting_pool}</div>
      <div className={`${styles.layout}`}>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <QuestionDisplay questionText="What is my name?" questionOptions={['Tyler', 'Sam', 'Dylan', 'Jacq']} />
        </ErrorBoundary>

        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <div className={`${styles.playerContainer}`}>
            {players.map((player) => (
              <Player
                key={player.id}
                name={player.name}
                avatarSeed={player.avatar_seed}
                bet={player.bet}
                balance={player.balance}
              />
            ))}
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
}
