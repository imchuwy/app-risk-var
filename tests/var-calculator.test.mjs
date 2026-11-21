import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parsePriceHistory } from '../src/lib/financial-data.ts';
import { calculateVaR } from '../src/lib/var-calculator.ts';

const position = (symbol, amount) => ({ id: symbol, symbol, position: amount, included: true });

test('matches exact price intervals and determines when data are insufficient', () => {
  const csv = [
    'tradedate,instrumentsymbol,midprice',
    '2025-01-01,A,100', '2025-01-02,A,110', '2025-01-03,A,121', '2025-01-04,A,100',
    '2025-01-01,B,100', '2025-01-03,B,130', '2025-01-04,B,120',
  ].join('\n');
  assert.equal(calculateVaR([position('A', 100), position('B', 100)], parsePriceHistory(csv), 'historical'), null);
});

test('the archived sample portfolio agrees with the independent Python notebook', () => {
  const csv = readFileSync(new URL('../public/prices/instrument_data.csv', import.meta.url), 'utf8');
  const history = parsePriceHistory(csv);
  const positions = [position('EURUSD', 60_000), position('USDJPY', 40_000)];
  const parametric = calculateVaR(positions, history, 'parametric');
  const historical = calculateVaR(positions, history, 'historical');
  assert.equal(history.size, 160);
  assert.equal(parametric.sampleSize, 321);
  assert.equal(parametric.firstDate, '2025-01-01');
  assert.equal(parametric.lastDate, '2025-11-18');
  for (const [actual, expected] of [
    [parametric.absoluteVaR, 328.3165730819181],
    [parametric.conditionalVaR, 411.7222281159259],
    [historical.absoluteVaR, 298.77169627078536],
    [historical.conditionalVaR, 389.9667443646763],
  ]) {
    assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} should equal ${expected}`);
  }
});
