'use client';

import { createClient } from '@/utils/supabase/client';

import AnswerButton from './buttons.answer';
import Money from './buttons.money';
import ButtonRow from './buttons.row';
import type { TablesUpdate } from '@/utils/supabase/database.types';
import type { Dispatch, SetStateAction } from 'react';
import BetModal from './bet-modal';

export default function Buttons({
  playerID,
  name,
  totalBet,
  balance,
  turnMode,
  call,
  bet,
  check,
  fold,
  isTurn,
  isFolded,
  round,
}: {
  playerID: string;
  name: string;
  totalBet: { get: number; set: Dispatch<SetStateAction<number>> };
  balance: { get: number; set: Dispatch<SetStateAction<number>> };
  turnMode: 'call' | 'check';
  bet: (n: number) => void;
  call: () => void;
  check: () => void;
  fold: () => void;
  isTurn: boolean;
  isFolded: boolean;
  round: number;
}) {
  const supabase = createClient();

  const actionClass = `btn btn-secondary flex-grow-1`;
  const actionStyle = { fontSize: '2rem' };

  const handleClick = async (option: number) => {
    const { error } = await supabase
      .from('active_players')
      .update({ answer_chosen: option } satisfies TablesUpdate<'active_players'>)
      .eq('player_id', playerID)
      .select();

    if (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="d-flex flex-column gap-3" style={{ height: '100%' }}>
        <div className="row">
          <span
            style={{
              fontSize: '3rem',
              lineHeight: '3.2rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </span>
        </div>
        <ButtonRow flexGrow={3}>
          <AnswerButton color="success" onClick={() => handleClick(1)} disabled={round !== 3}>
            <i className="bi bi-square" />
          </AnswerButton>
          <AnswerButton color="danger" onClick={() => handleClick(2)} disabled={round !== 3}>
            <i className="bi bi-circle" />
          </AnswerButton>
        </ButtonRow>
        <ButtonRow flexGrow={3}>
          <AnswerButton color="warning" onClick={() => handleClick(3)} disabled={round !== 3}>
            <i className="bi bi-triangle" />
          </AnswerButton>
          <AnswerButton color="info" onClick={() => handleClick(4)} disabled={round !== 3}>
            <i className="bi bi-diamond" />
          </AnswerButton>
        </ButtonRow>
        <ButtonRow flexGrow={2}>
          {turnMode === 'call' ? (
            <button
              type="button"
              className={actionClass}
              style={actionStyle}
              onClick={call}
              disabled={!isTurn || isFolded}
            >
              Call
            </button>
          ) : (
            <button
              type="button"
              className={actionClass}
              style={actionStyle}
              onClick={check}
              disabled={!isTurn || isFolded}
            >
              Check
            </button>
          )}
          <button
            type="button"
            className={actionClass}
            data-bs-toggle="modal"
            data-bs-target="#betModal"
            disabled={!isTurn || isFolded}
            style={actionStyle}
          >
            Bet
          </button>
          <button
            type="button"
            className={actionClass}
            style={actionStyle}
            onClick={fold}
            disabled={!isTurn || isFolded}
          >
            Fold
          </button>
        </ButtonRow>
        <div className="row">
          <Money name="Bet" amount={totalBet.get} />
          <Money name="Balance" amount={balance.get} />
        </div>
      </div>
      <BetModal maxBet={balance.get} bet={bet} />
    </>
  );
}
