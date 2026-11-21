export type Instrument = {
  id: string;
  symbol: string;
  position: number;
  included: boolean;
};

export type VaRMethod = 'parametric' | 'historical';

export type VaRResult = {
  method: VaRMethod;
  absoluteVaR: number;
  varPercentageOfNAV: number;
  conditionalVaR: number;
  portfolioValue: number;
  portfolioStdDev: number;
  averagePnl: number;
  sampleSize: number;
  firstDate: string;
  lastDate: string;
  tailCount: number;
  worstScenarios: { from: string; to: string; pnl: number }[];
};
