import { createClient } from '@/utils/supabase/server';

const nextPlayer = async (playerID: string, sessionCode: string): Promise<string | null> => {
  const supabase = await createClient();

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
