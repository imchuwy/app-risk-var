'use client';

import type { Instrument, VaRResult } from '@/lib/types';
import { VarResultsDisplay } from './var-results-display';
import { DistributionChart } from './distribution-chart';
import { InstrumentDetailTable } from './instrument-detail-table';

type MainDashboardProps = {
  varResults: VaRResult | null;
  isCalculating: boolean;
  loadError: boolean;
  retryPrices: () => void;
  instruments: Instrument[];
  toggleInstrument: (id: string) => void;
  removeInstrument: (id: string) => void;
};

export function MainDashboard({
  varResults,
  isCalculating,
  loadError,
  retryPrices,
  instruments,
  toggleInstrument,
  removeInstrument,
}: MainDashboardProps) {
  return (
    <main className="min-w-0 flex-1 p-4 sm:p-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6">
        <p className="text-sm text-muted-foreground">
          Compare historical and parametric risk using an archived snapshot of instrument mid-prices. Positions are hypothetical USD exposures.
        </p>
        <div className="col-span-1">
          <VarResultsDisplay
            varResults={varResults}
            isCalculating={isCalculating}
            loadError={loadError}
            retryPrices={retryPrices}
            hasPositions={instruments.some(instrument => instrument.included)}
          />
        </div>
        {varResults && <DistributionChart varResults={varResults} />}
        <div className="col-span-1">
          <InstrumentDetailTable
            instruments={instruments}
            varResults={varResults}
            toggleInstrument={toggleInstrument}
            removeInstrument={removeInstrument}
          />
        </div>
      </div>
    </main>
  );
}
