'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { VaRResult } from '@/lib/types';

type VarResultsDisplayProps = {
  varResults: VaRResult | null;
  isCalculating: boolean;
  loadError: boolean;
  retryPrices: () => void;
  hasPositions: boolean;
};

const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const currency = (value: number) => dollars.format(value);

export function VarResultsDisplay({
  varResults, isCalculating, loadError, retryPrices, hasPositions,
}: VarResultsDisplayProps) {
  const result = varResults;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio risk</CardTitle>
        <CardDescription>
          One observation interval at 95% confidence.
          {result && ` ${result.sampleSize} matched intervals, ${result.firstDate} to ${result.lastDate}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {loadError ? (
          <div className="flex flex-wrap items-center gap-3" role="alert">
            <p>The archived pricing file could not be loaded.</p>
            <Button type="button" variant="outline" onClick={retryPrices}>Retry</Button>
          </div>
        ) : !result ? (
          <p className="text-sm text-muted-foreground" role="status">
            {isCalculating ? 'Loading archived prices...' : hasPositions
              ? 'The selected instruments have fewer than two matching price intervals. Try removing an instrument.'
              : 'Include instruments in your portfolio to calculate VaR.'}
          </p>
        ) : (
          <>
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ['VaR (95%)', currency(result.absoluteVaR)],
                ['Portfolio value', currency(result.portfolioValue)],
                ['VaR % of NAV', result.varPercentageOfNAV.toFixed(2) + '%'],
                ['Expected shortfall (95%)', currency(result.conditionalVaR)],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 rounded-lg border bg-background p-3 first:border-primary first:bg-card">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="break-words text-xl font-semibold tabular-nums text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <details className="rounded-lg border p-4 text-sm">
              <summary className="cursor-pointer font-semibold">Show calculation workings</summary>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>Compute each instrument return as (ending mid-price / starting mid-price) − 1.</li>
                <li>Keep intervals with identical start and end dates for every included instrument. Multiply each return by its USD position and sum to get portfolio P/L.</li>
                <li>
                  {result.method === 'parametric'
                    ? `Set the model mean to zero. The sample standard deviation of portfolio P/L is ${currency(result.portfolioStdDev)}. Multiply by 1.644854 for VaR or 2.062713 for expected shortfall.`
                    : `Sort portfolio losses. Interpolate at the 95th percentile for VaR and average the worst ${result.tailCount.toFixed(2)} observations for expected shortfall, including a proportional share of the boundary observation.`}
                </li>
              </ol>
              <p className="mt-3 text-muted-foreground">Observed mean portfolio P/L {currency(result.averagePnl)}.</p>
              <table className="mt-3 w-full text-left tabular-nums">
                <caption className="mb-2 text-left font-medium">Worst observed intervals</caption>
                <thead><tr><th scope="col">Start</th><th scope="col">End</th><th scope="col" className="text-right">Portfolio P/L</th></tr></thead>
                <tbody>
                  {result.worstScenarios.map(({ from, to, pnl }) => (
                    <tr key={from + to} className="border-t">
                      <td className="py-1">{from}</td><td>{to}</td><td className="text-right">{currency(pnl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </>
        )}
      </CardContent>
    </Card>
  );
}
