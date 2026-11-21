'use client';

import { useState, useMemo, useEffect } from 'react';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from './app-header';
import { MainDashboard } from './main-dashboard';
import { SidebarContent } from './sidebar-content';
import { calculateVaR } from '@/lib/var-calculator';
import { parsePriceHistory, type PriceHistory } from '@/lib/financial-data';
import type { Instrument } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function VarModelPage() {
  const { toast } = useToast();
  const [simulationMethod, setSimulationMethod] = useState('parametric');
  const [instruments, setInstruments] = useState<Instrument[]>([
    { id: 'eurusd', symbol: 'EURUSD', position: 60000, included: true },
    { id: 'usdjpy', symbol: 'USDJPY', position: 40000, included: true },
  ]);

  const [prices, setPrices] = useState<PriceHistory | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const path = (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/prices/instrument_data.csv';
    fetch(path, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Pricing download failed.');
        return response.text();
      })
      .then(parsePriceHistory)
      .then(setPrices)
      .catch(() => {
        if (!controller.signal.aborted) setLoadError(true);
      });
    return () => controller.abort();
  }, [loadAttempt]);

  const availableSymbols = useMemo(() => prices ? [...prices]
    .filter(([, observations]) => observations.size >= 3)
    .map(([symbol]) => symbol)
    .sort() : [], [prices]);

  function retryPrices() {
    setLoadError(false);
    setLoadAttempt(attempt => attempt + 1);
  }

  // Handle instrument management
  const addInstrument = (instrument: Omit<Instrument, 'id' | 'included'>) => {
     // Check if instrument with same symbol already exists
    const existingInstrument = instruments.find(inst => inst.symbol === instrument.symbol);
    if (existingInstrument) {
      toast({
        title: 'Instrument Exists',
        description: `An instrument with the symbol ${instrument.symbol} is already in the portfolio.`,
        variant: 'destructive',
      });
      return;
    }
    setInstruments((prev) => [
      ...prev,
      { ...instrument, id: crypto.randomUUID(), included: true },
    ]);
  };

  const removeInstrument = (id: string) => {
    setInstruments((prev) => prev.filter((inst) => inst.id !== id));
  };
  
  const toggleInstrument = (id: string) => {
    setInstruments(prev => 
      prev.map(inst => 
        inst.id === id ? { ...inst, included: !inst.included } : inst
      )
    );
  };

  const varResults = useMemo(() => {
    const active = instruments.filter(instrument => instrument.included);
    if (!active.length || !prices) return null;
    const method = simulationMethod === 'historical' ? 'historical' : 'parametric';
    return calculateVaR(active, prices, method);
  }, [instruments, simulationMethod, prices]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <AppHeader />
        <div className="flex flex-1">
          <Sidebar collapsible="icon" className="border-r">
            <SidebarContent
              simulationMethod={simulationMethod}
              setSimulationMethod={setSimulationMethod}
              instruments={instruments}
              addInstrument={addInstrument}
              removeInstrument={removeInstrument}
              availableSymbols={availableSymbols}
            />
          </Sidebar>
          <SidebarInset>
            <MainDashboard
              varResults={varResults}
              isCalculating={!prices && !loadError}
              loadError={loadError}
              retryPrices={retryPrices}
              instruments={instruments}
              toggleInstrument={toggleInstrument}
              removeInstrument={removeInstrument}
            />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
