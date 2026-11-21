'use client';

import { useState, useMemo } from 'react';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from './app-header';
import { MainDashboard } from './main-dashboard';
import { SidebarContent } from './sidebar-content';
import { calculateVaR } from '@/lib/var-calculator';
import { availableSymbols, getDemoReturns } from '@/lib/demo-returns';
import type { Instrument } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function VarModelPage() {
  const { toast } = useToast();
  const [simulationMethod, setSimulationMethod] = useState('parametric');
  const [instruments, setInstruments] = useState<Instrument[]>([
    { id: 'demo-equity', symbol: 'DEMO-EQUITY', position: 60000, included: true },
    { id: 'demo-bond', symbol: 'DEMO-BOND', position: 40000, included: true },
  ]);

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
    if (!active.length) return null;
    const method = simulationMethod === 'historical' ? 'historical' : 'parametric';
    return calculateVaR(active, getDemoReturns(active), method);
  }, [instruments, simulationMethod]);

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
              isCalculating={false}
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
