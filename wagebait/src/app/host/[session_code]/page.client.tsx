'use client';

import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Player from './player';
import QuestionDisplay from './questiondisplay';
import { createClient } from '@/utils/supabase/client';
import type { Tables } from '@/utils/supabase/database.types';
import type { PostgrestResponse } from '@supabase/postgrest-js';

import styles from './page.module.css';

export default function HostClient({ session_code }: { session_code: string }) {
  const supabase = createClient();

  const [players, setPlayers] = useState<Tables<'active_players'>[] | null>(null);
  const [currentGame, setCurrentGame] = useState<Tables<'active_games'> | null>(null);
  const [categories, setCategories] = useState<Tables<'category'>[] | null>(null);
  const [questions, setQuestions] = useState<Tables<'question'>[] | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = (await supabase
        .from('active_players')
        .select('*')
        .eq('session_code', session_code)) satisfies PostgrestResponse<Tables<'active_players'>>;
      if (error) {
        console.error('Error fetching players:', error);
      }
      setPlayers(data as Tables<'active_players'>[]);
    };

    fetchPlayers();
  }, [session_code, supabase]);

  useEffect(() => {
    const fetchCurrentGame = async () => {
      const { data, error } = await supabase.from('active_games').select('*').eq('session_code', session_code).single();
      if (error) {
        console.error('Error fetching current game:', error);
      }
      setCurrentGame(data);
    };
    fetchCurrentGame();
  }, [session_code, supabase]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('category').select('*').eq('game_id', currentGame?.game_id);
      if (error) {
        console.error('Error fetching categories:', error);
      }
      setCategories(data);
    };
    fetchCategories();
  }, [currentGame, supabase]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('question')
        .select('*')
        .in('category_id', categories?.map((category) => category.category_id) || []);
      if (error) {
        console.error('Error fetching questions:', error);
      }
      setQuestions(data);
    };
    fetchQuestions();
  }, [categories, supabase]);

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
              key={currentQuestion.category_id}
              questionText={currentQuestion.question_text ?? ''}
              questionOptions={[
                currentQuestion.option_1 ?? '',
                currentQuestion.option_2 ?? '',
                currentQuestion.option_3 ?? '',
                currentQuestion.option_4 ?? '',
              ]}
            />
          ) : (
            <div>No current question available</div>
          )}
        </ErrorBoundary>

        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <div className={`${styles.playerContainer}`}>
            {players &&
              players.map((player) => (
                <Player
                  key={player.player_id}
                  name={player.player_name ?? ''}
                  avatarSeed={player.avatar_seed ?? 'a'}
                  bet={player.bet}
                  balance={player.balance ?? 0}
                />
              ))}
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
}
