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

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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

  const current = demoOptions.find((o) => o.id === demoState);

  return (
    <div className="fixed bottom-3 left-3 sm:left-5 z-40 select-none flex flex-col items-start">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mb-2 w-[240px] p-1.5 rounded-xl bg-[#0f1219]/95 border border-white/10 shadow-2xl backdrop-blur"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
          >
            <div className="px-2 pt-1 pb-1.5 text-[9.5px] font-mono uppercase tracking-[0.18em] text-slate-500">
              Demo scenarios
            </div>
            {demoOptions.map((opt) => {
              const isActive = demoState === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setDemoState(opt.id)}
                  className={`w-full px-2 py-1.5 rounded-lg text-[12px] flex items-center gap-2 text-left transition-colors ${
                    isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={opt.description}
                >
                  <span className="shrink-0">{opt.icon}</span>
                  <span className="flex-1">{opt.label.replace(/^\d\.\s*/, '')}</span>
                  <kbd className="text-[9.5px] font-mono text-slate-500 border border-white/10 rounded px-1">{opt.key}</kbd>
                </button>
              );
            })}
            <div className="mt-1 pt-1 border-t border-white/5 flex">
              <button
                onClick={openWorkflow}
                className="flex-1 px-2 py-1.5 rounded-lg text-[11.5px] text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5"
              >
                <GitMerge className="w-3.5 h-3.5" /> Workflow timeline
              </button>
              <button
                onClick={returnToWorkforceMap}
                className="px-2 py-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5"
                title="Close panels (Esc)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-9 px-3 rounded-full flex items-center gap-2 text-[12px] text-slate-300 hover:text-white bg-[#0f1219]/90 border border-white/10 hover:border-white/25 shadow-xl transition-colors"
        title="Demo scenarios (keys 1-6)"
      >
        <Sliders className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{current ? current.label.replace(/^\d\.\s*/, '') : 'Scenarios'}</span>
        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-500" />}
      </button>
    </div>
  );
};
