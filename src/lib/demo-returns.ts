// Three fictional instruments follow a shared market factor and independent
// shocks. A fixed seed returns the same 252 aligned daily observations on every load.
import type { Instrument } from './types';

const symbols = ['DEMO-BOND', 'DEMO-EQUITY', 'DEMO-TECH'];
let seed = 104729;

function random() {
  seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
  return (seed + 1) / 4294967297;
}

function shock() {
  return Math.sqrt(-2 * Math.log(random())) * Math.cos(2 * Math.PI * random());
}

const history = new Map(symbols.map(symbol => [symbol, [] as number[]]));

for (let day = 0; day < 252; day++) {
  const market = shock();
  history.get('DEMO-BOND')!.push(market * 0.002 + shock() * 0.002);
  history.get('DEMO-EQUITY')!.push(market * 0.009 + shock() * 0.004);
  history.get('DEMO-TECH')!.push(market * 0.013 + shock() * 0.009);
}

export const availableSymbols = symbols;

export function getDemoReturns(instruments: Instrument[]) {
  return new Map(instruments.map(({ symbol }) => {
    const observations = history.get(symbol);
    if (!observations) throw new Error('Unknown demo instrument: ' + symbol);
    return [symbol, observations];
  }));
}
