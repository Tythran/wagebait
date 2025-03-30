import { ErrorBoundary } from 'react-error-boundary';

import { createClient } from '@/utils/supabase/client';

import styles from './page.module.css';
import Player from './player';
import QuestionDisplay from './questiondisplay';

const supabase = createClient();

export default async function Host({ params }: { params: Promise<{ session_code: string }> }) {
  const { session_code } = await params;
  console.log(session_code);

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from('players').select('*').eq('session_code', session_code);
    if (error) {
      console.error('Error fetching players:', error);
    }
    return data ?? [];
  };

  const players = await fetchPlayers();
  const fetchCurrentGame = async () => {
    const { data, error } = await supabase.from('active_games').select('*').eq('session_code', session_code).single();
    if (error) {
      console.error('Error fetching current game:', error);
    }
    return data;
  };

  const currentGame = await fetchCurrentGame();
  const fetchCategories = async () => {
    const { data, error } = await supabase.from('category').select('*').eq('game_id', currentGame?.game_id);
    if (error) {
      console.error('Error fetching categories:', error);
    }
    return data;
  };
  const categories = await fetchCategories();
  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('question')
      .select('*')
      .in('category_id', categories?.map((category) => category.id) || []);
    if (error) {
      console.error('Error fetching questions:', error);
    }
    return data;
  };
  const questions = await fetchQuestions();

  const shuffledQuestions = questions?.sort(() => Math.random() - 0.5) || [];
  console.log(shuffledQuestions);

  let currentQuestionIndex = 0;

  const handleCurrentQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length) {
      return shuffledQuestions[currentQuestionIndex];
    } else {
      console.warn('No more questions available.');
      return null;
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      currentQuestionIndex++;
      return shuffledQuestions[currentQuestionIndex];
    } else {
      console.warn('No more questions available.');
      return null;
    }
  };

  const currentQuestion = handleCurrentQuestion();
  console.log('Current Question:', currentQuestion);
  console.log('next Question:', handleNextQuestion());

  return (
    <>
      <div className={`${styles.pot}`}>Betting Pool: {currentGame?.betting_pool}</div>
      <div className={`${styles.layout}`}>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          {currentQuestion ? (
            <QuestionDisplay
              key={currentQuestion.id}
              questionText={currentQuestion.text}
              questionOptions={currentQuestion.options}
            />
          ) : (
            <div>No current question available</div>
          )}
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
