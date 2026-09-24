import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexus } from '../../context/NexusContext';
import { DemoState } from '../../types/nexus';
import {
  Sparkles,
  ShieldAlert,
  TrendingDown,
  UserMinus,
  Clock,
  GitMerge,
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const DemoDock: React.FC = () => {
  const {
    demoState,
    setDemoState,
    returnToWorkforceMap,
    openWorkflow,
  } = useNexus();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const demoOptions: { id: DemoState; label: string; key: string; icon: React.ReactNode; description: string }[] = [
    {
      id: 'calm',
      label: '1. Calm System',
      key: '1',
      icon: <Sparkles className="w-3.5 h-3.5 text-slate-300" />,
      description: 'Workforce in peaceful idle equilibrium. No alerts.',
    },
    {
      id: 'payment_issue',
      label: '2. Payment Issue',
      key: '2',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />,
      description: 'Payment Sentinel blinks: failure rate 3.4x spike on UPI.',
    },
    {
      id: 'revenue_risk',
      label: '3. Revenue Risk',
      key: '3',
      icon: <TrendingDown className="w-3.5 h-3.5 text-sky-400" />,
      description: 'Revenue Forecaster active: downward sales trajectory.',
    },
    {
      id: 'customer_risk',
      label: '4. Customer Risk',
      key: '4',
      icon: <UserMinus className="w-3.5 h-3.5 text-amber-400" />,
      description: 'Churn Predictor flags 1,420 high-value buyers at risk.',
    },
    {
      id: 'approval_required',
      label: '5. Approval Required',
      key: '5',
      icon: <Clock className="w-3.5 h-3.5 text-violet-400" />,
      description: 'Campaign Strategist awaits merchant sign-off.',
    },
    {
      id: 'multi_agent_workflow',
      label: '6. Multi-Agent Flow',
      key: '6',
      icon: <GitMerge className="w-3.5 h-3.5 text-emerald-400" />,
      description: 'Cross-department autonomous revenue recovery workflow.',
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 select-none flex flex-col items-center">
      {/* Floating Pill Controller */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141519] border border-white/20 shadow-2xl">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          title="Toggle Scenario Switcher"
        >
          <Sliders className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">Scenarios</span>
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {/* Workflow trigger */}
        <button
          onClick={openWorkflow}
          className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors border-l border-white/10"
          title="Open Workflow Timeline (W)"
        >
          <GitMerge className="w-3.5 h-3.5 text-white" />
          <span className="hidden md:inline">Workflow Flow</span>
        </button>

        {/* Reset view */}
        <button
          onClick={returnToWorkforceMap}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Close Panels (ESC)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expanded Scenario Bar */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mt-2 flex flex-wrap items-center justify-center gap-1 p-1.5 rounded-xl bg-[#121317] border border-white/15 shadow-2xl max-w-[95vw]"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            {demoOptions.map((opt) => {
              const isActive = demoState === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setDemoState(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-white text-black font-bold border border-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-white/10'
                  }`}
                  title={opt.description}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                  <span
                    className={`hidden sm:inline text-[9px] px-1 py-0.2 rounded font-mono ${
                      isActive ? 'bg-black/15 text-black' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    [{opt.key}]
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
