'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertCircle, Info } from 'lucide-react';
import type { VaRResult } from '@/lib/types';

type VarResultsDisplayProps = {
  varResults: VaRResult | null;
  isCalculating: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatPercentage = (value: number) =>
  `${value.toFixed(2)}%`;

export function VarResultsDisplay({
  varResults,
  isCalculating,
}: VarResultsDisplayProps) {
  const hasResults = varResults && varResults.portfolioValue > 0;

  const metrics = [
    { label: 'Portfolio Value', value: varResults?.portfolioValue, formatter: formatCurrency },
    { label: 'Absolute VaR (95%)', value: varResults?.absoluteVaR, formatter: formatCurrency },
    { label: 'VaR % of NAV', value: varResults?.varPercentageOfNAV, formatter: formatPercentage },
    { label: 'Conditional VaR (95%)', value: varResults?.conditionalVaR, formatter: formatCurrency },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Value at Risk (VaR) Results</CardTitle>
          <CardDescription>
            One-day risk at 95% confidence, using simulated returns.
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              disabled={isCalculating || !hasResults}
            >
              <Info className="mr-2 h-4 w-4" />
              Explain Results
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Reading the risk estimate
              </DialogTitle>
              <DialogDescription>
                Estimates use fictional instruments and simulated data.
              </DialogDescription>
            </DialogHeader>
            <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
              {hasResults && (
                <p>
                  The model estimates a one-day loss of {formatCurrency(varResults.absoluteVaR)} or more
                  in roughly 5% of scenarios. Conditional VaR estimates the average loss in that tail
                  at {formatCurrency(varResults.conditionalVaR)}.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!hasResults ? (
          <div className="flex min-h-[120px] items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-6 text-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-8 w-8" />
              <p className="font-medium">No results to display</p>
              <p className="text-sm">
                Add instruments to your portfolio to calculate VaR.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg border bg-card p-4 text-center shadow-sm"
              >
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                {isCalculating ? (
                  <Skeleton className="mx-auto mt-1 h-7 w-2/3" />
                ) : (
                  <p className="text-2xl font-bold text-primary">
                    {metric.value !== undefined ? metric.formatter(metric.value) : '-'}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
