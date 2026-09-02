export const PRIZES = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300,
  400, 500, 750, 1_000, 5_000, 10_000, 25_000, 100_000, 500_000, 1_000_000,
];

export const ROUND_TARGETS = [6, 5, 4, 3, 2, 1, 1, 1, 1];
export const OFFER_FACTORS = [0.3, 0.42, 0.56, 0.7, 0.8, 0.88, 0.93, 0.97, 1];

export type Phase = 'select' | 'playing' | 'offer' | 'swap' | 'finished';

export type Game = {
  caseValues: number[];
  seed: number;
};

export type OpenedRecord = {
  caseNumber: number;
  value: number;
};

export function createGame(seed: number): Game {
  const values = [...PRIZES];
  let state = seed >>> 0;
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }

  return { caseValues: values, seed };
}

export function formatMoney(value: number, compact = false) {
  if (value === 0.01) return '$0.01';
  if (compact && value >= 1_000_000) return '$1M';
  if (compact && value >= 1_000) return `$${value / 1_000}K`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
