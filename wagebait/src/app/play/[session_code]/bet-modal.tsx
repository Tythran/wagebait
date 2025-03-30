'use client';

import { useState } from 'react';

export default function BetModal({ maxBet, bet }: { maxBet: number; bet: (amount: number) => void }) {
  const [betAmount, setBetAmount] = useState(maxBet * 0.1);

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(parseInt(event.target.value, 10));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue)) setBetAmount(newValue);
  };

  const handleBet = () => {
    bet(betAmount);
  };

  return (
    <div className="modal" id="betModal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-bg-dark">
          <div className="modal-header">
            <h5 className="modal-title">Place your bet</h5>
          </div>
          <div className="modal-body">
            <form>
              <div className="d-flex align-items-center">
                <label htmlFor="betRange" className="me-2">
                  1
                </label>
                <input
                  type="range"
                  className="form-range flex-grow-1"
                  min={1}
                  max={maxBet}
                  id="betRange"
                  step={1}
                  value={betAmount}
                  onChange={handleRangeChange}
                />
                <label htmlFor="betRange" className="ms-2">
                  {maxBet}
                </label>
              </div>
              <input
                type="number"
                id="betAmount"
                className="form-control mt-3"
                min={1}
                max={maxBet}
                placeholder="Enter bet amount"
                value={betAmount}
                onChange={handleInputChange}
              />
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleBet}>
              Place bet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
