export type Instrument = {
  id: string;
  symbol: string;
  position: number;
  included: boolean;
};

export type VaRResult = {
  absoluteVaR: number;
  varPercentageOfNAV: number;
  conditionalVaR: number;
  portfolioValue: number;
  portfolioStdDev: number;
};
