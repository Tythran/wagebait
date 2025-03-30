'use client';

import { useEffect, useState } from 'react';

import { randomString } from '@/components/utils';
import { createClient } from '@/utils/supabase/client';

import Buttons from './buttons';
import InitPlayer from './init-player';
import type { Tables, TablesUpdate } from '@/utils/supabase/database.types';

export default function Client({ sessionCode }: { sessionCode: string }) {
  const supabase = createClient();

  const activeGamesChannel = supabase.channel('active-games-channel');
  activeGamesChannel
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'active_games', filter: `session_code=${sessionCode}` },
      (payload) => handleGameUpdate(payload.new as Tables<'active_games'>)
    )
    .subscribe();

  // ===================================================================================================================

  // game state
  const blindBet = 5;
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [lastBetter, setLastBetter] = useState<string | null>(null);
  const [newBets, setNewBets] = useState<boolean>(false);
  const [round, setRound] = useState<number>(0);

  // player state
  const [isTurn, setIsTurn] = useState<boolean>(false);
  const [isFolded, setIsFolded] = useState<boolean>(false);

  const [turnMode, setTurnMode] = useState<'call' | 'check'>('call');

  // player info
  const [playerID, setPlayerID] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [avatarSeed, setAvatarSeed] = useState<string>(randomString());
  const [totalBet, setTotalBet] = useState<number>(0);
  const [balance, setBalance] = useState<number>(1000);

  // ===================================================================================================================

  const handleGameUpdate = (newState: Tables<'active_games'>) => {
    setCurrentBet(newState.current_bet);
    setLastBetter(newState.last_better);
    setNewBets(newState.new_bets ?? false);

    if (round !== newState.round_number) {
      setRound(newState.round_number);
    }

    const _isTurn = newState.current_player === playerID;
    const _isBlind = newState.blind_player === playerID;

    if (_isTurn && _isBlind) {
      blind();
    } else if (_isTurn) {
      setTurnMode(newState.last_better === playerID ? 'check' : 'call');
      setIsTurn(true);
    }
  };

  // ===================================================================================================================

  useEffect(() => {
    if (!playerID) return;
    const handleBeforeUnload = async () => {
      const { error } = await supabase.from('active_players').delete().eq('player_id', playerID);
      if (error) console.error(error);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [playerID, supabase]);

  // ===================================================================================================================

  const blind = async () => {
    const bet = blindBet;
    setTotalBet(bet);
    setBalance((prev) => prev - bet);

    updatePlayer(bet);

    const { error: gameError } = await supabase
      .from('active_games')
      .update({
        blind_player: null,
        new_bets: true,
        current_player: await nextPlayer(),
        current_bet: bet,
      } satisfies TablesUpdate<'active_games'>)
      .eq('session_code', sessionCode);
    if (gameError) console.error('Error updating row in active_games', gameError);
  };

  const check = async () => {
    let newRow: TablesUpdate<'active_games'> = {
      current_player: await nextPlayer(),
    };

    if (lastBetter === playerID && !newBets)
      newRow = {
        ...newRow,
        round_number: round + 1,
      };
    else if (lastBetter === playerID && newBets)
      newRow = {
        ...newRow,
        new_bets: false,
      };

    const { error: gameError } = await supabase.from('active_games').update(newRow).eq('session_code', sessionCode);
    if (gameError) console.error('Error updating row in active_games', gameError);
  };

  const call = async () => {
    const bet = currentBet! - totalBet;
    setTotalBet((prev) => prev + bet);
    setBalance((prev) => prev - bet);

    updatePlayer(bet);

    const { error: gameError } = await supabase
      .from('active_games')
      .update({
        current_player: await nextPlayer(),
      } satisfies TablesUpdate<'active_games'>)
      .eq('session_code', sessionCode);
    if (gameError) console.error('Error updating row in active_games', gameError);
  };

  const bet = async (bet: number) => {
    bet = currentBet! - totalBet + bet;
    setTotalBet((prev) => prev + bet);
    setBalance((prev) => prev - bet);

    updatePlayer(bet);

    const { error: gameError } = await supabase
      .from('active_games')
      .update({
        new_bets: true,
        current_player: await nextPlayer(),
        current_bet: totalBet + bet,
      } satisfies TablesUpdate<'active_games'>)
      .eq('session_code', sessionCode);
    if (gameError) console.error('Error updating row in active_games', gameError);
  };

  const fold = async () => {
    setIsFolded(true);

    const { error: playerError } = await supabase
      .from('active_players')
      .update({
        folded: true,
      } satisfies TablesUpdate<'active_players'>)
      .eq('player_id', playerID);
    if (playerError) console.error('Error updating row in active_players', playerError);

    const { error: gameError } = await supabase
      .from('active_games')
      .update({
        current_player: await nextPlayer(),
      } satisfies TablesUpdate<'active_games'>)
      .eq('session_code', sessionCode);
    if (gameError) console.error('Error updating row in active_games', gameError);
  };

  const updatePlayer = async (bet: number) => {
    const { error: playerError } = await supabase
      .from('active_players')
      .update({
        turn_bet: bet,
        total_bet: totalBet + bet,
        balance: balance - bet,
      } satisfies TablesUpdate<'active_players'>)
      .eq('player_id', playerID)
      .select();
    if (playerError) console.error('Error updating row in active_players', playerError);
  };

  const nextPlayer = async (): Promise<string | null> => {
    const { data: playerNumbers, error: fetchPlayersError } = await supabase
      .from('active_players')
      .select('player_number, player_id')
      .eq('session_code', sessionCode)
      .overrideTypes<Array<{ player_id: string; player_number: number }>>();
    if (fetchPlayersError) {
      console.error(fetchPlayersError);
    } else {
      playerNumbers.sort((a, b) => a.player_number - b.player_number);
      const curPlayerIdx = playerNumbers.findIndex((player) => player.player_id === playerID);
      const nextPlayerIdx = (curPlayerIdx + 1) % playerNumbers.length;
      return playerNumbers[nextPlayerIdx].player_id;
    }
    return null;
  };

  // ===================================================================================================================

  if (!playerName || !playerID) {
    return (
      <InitPlayer
        sessionCode={sessionCode}
        playerID={{ get: playerID, set: setPlayerID }}
        playerName={{ get: playerName, set: setPlayerName }}
        avatarSeed={{ get: avatarSeed, set: setAvatarSeed }}
        bet={{ get: totalBet, set: setTotalBet }}
        balance={{ get: balance, set: setBalance }}
      />
    );
  }

  return (
    <Buttons
      playerID={playerID}
      name={playerName}
      totalBet={{ get: totalBet, set: setTotalBet }}
      balance={{ get: balance, set: setBalance }}
      check={check}
      call={call}
      bet={bet}
      fold={fold}
      isTurn={isTurn}
      isFolded={isFolded}
      turnMode={turnMode}
      round={round}
    />
  );
}
