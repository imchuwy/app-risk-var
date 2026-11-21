import type { PriceHistory } from './financial-data';
import type { Instrument, VaRMethod, VaRResult } from './types';

const tailProbability = 0.05;
const normalQuantile = 1.6448536269514722;
const normalTailMean = Math.exp(-(normalQuantile ** 2) / 2) /
  (Math.sqrt(2 * Math.PI) * tailProbability);

export function calculateVaR(
  instruments: Instrument[],
  prices: PriceHistory,
  method: VaRMethod,
): VaRResult | null {
  const portfolioValue = instruments.reduce((sum, { position }) => sum + position, 0);
  if (!Number.isFinite(portfolioValue) || portfolioValue <= 0) return null;

  // Each position contributes a return for the same start and end date.
  const scenarios = new Map<string, { from: string; to: string; pnl: number; count: number }>();
  for (const { symbol, position } of instruments) {
    const history = prices.get(symbol);
    if (!history) return null;
    const observations = [...history].sort(([left], [right]) => left.localeCompare(right));
    for (let index = 1; index < observations.length; index++) {
      const [from, previous] = observations[index - 1];
      const [to, current] = observations[index];
      const key = from + '/' + to;
      const scenario = scenarios.get(key) ?? { from, to, pnl: 0, count: 0 };
      scenario.pnl += position * (current / previous - 1);
      scenario.count++;
      scenarios.set(key, scenario);
    }
  }

  const aligned = [...scenarios.values()].filter(({ count }) => count === instruments.length);
  const sampleSize = aligned.length;
  if (sampleSize < 2) return null;

  const averagePnl = aligned.reduce((sum, { pnl }) => sum + pnl, 0) / sampleSize;
  const squaredDeviations = aligned.reduce((sum, { pnl }) => sum + (pnl - averagePnl) ** 2, 0);
  const portfolioStdDev = Math.sqrt(squaredDeviations / (sampleSize - 1));
  const sortedLosses = aligned.map(({ pnl }) => -pnl).sort((left, right) => right - left);
  const rank = tailProbability * (sampleSize - 1);
  const lowerIndex = Math.floor(rank);
  const interpolation = rank - lowerIndex;
  const historicalVaR = sortedLosses[lowerIndex] * (1 - interpolation) +
    sortedLosses[lowerIndex + 1] * interpolation;
  const tailCount = sampleSize * tailProbability;
  const fullObservations = Math.floor(tailCount);
  const historicalES = (
    sortedLosses.slice(0, fullObservations).reduce((sum, loss) => sum + loss, 0) +
    sortedLosses[fullObservations] * (tailCount - fullObservations)
  ) / tailCount;

  const absoluteVaR = method === 'parametric' ? normalQuantile * portfolioStdDev : historicalVaR;
  const conditionalVaR = method === 'parametric' ? normalTailMean * portfolioStdDev : historicalES;

  return {
    method,
    absoluteVaR,
    varPercentageOfNAV: (absoluteVaR / portfolioValue) * 100,
    conditionalVaR,
    portfolioValue,
    portfolioStdDev,
    averagePnl,
    sampleSize,
    firstDate: aligned[0].from,
    lastDate: aligned[sampleSize - 1].to,
    tailCount,
    worstScenarios: [...aligned].sort((left, right) => left.pnl - right.pnl).slice(0, 5),
  };
}
