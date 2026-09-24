import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexus } from '../../context/NexusContext';
import {
  X,
  Play,
  RotateCcw,
  GitMerge,
  Check,
  Activity,
  Clock,
  Sparkles,
} from 'lucide-react';

export const WorkflowModal: React.FC = () => {
  const {
    workflow,
    isWorkflowOpen,
    closeWorkflow,
    stepWorkflowForward,
    resetWorkflow,
    selectAgent,
  } = useNexus();

  if (!isWorkflowOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeWorkflow}
        />

        {/* Modal Container */}
        <motion.div
          className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-xl bg-[#141519] border border-white/20 shadow-2xl overflow-hidden z-10 text-slate-100"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/15 bg-[#17181F]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#252732] border border-white/15 flex items-center justify-center text-white">
                <GitMerge className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Multi-Agent Workflow Timeline
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={stepWorkflowForward}
                disabled={workflow.currentStepIndex >= workflow.steps.length - 1}
                className="px-3 py-1 rounded bg-white hover:bg-slate-200 text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors disabled:opacity-30"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Next Step</span>
              </button>

              <button
                onClick={resetWorkflow}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={closeWorkflow}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Trigger Event Banner */}
          <div className="px-5 py-2.5 bg-[#191B22] border-b border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">
              <strong className="text-white">Trigger:</strong> {workflow.trigger}
            </span>
            <span className="text-slate-400 text-[11px]">
              Step {workflow.currentStepIndex + 1} of {workflow.steps.length}
            </span>
          </div>

          {/* Steps Timeline */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {workflow.steps.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';
              const isApproval = step.status === 'approval_required';

              return (
                <div
                  key={step.stepNumber}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-[#1C1F28] border-2 border-white text-white'
                      : isApproval
                      ? 'bg-[#1F1C28] border border-violet-400 text-white'
                      : isCompleted
                      ? 'bg-[#181920] border border-white/20'
                      : 'bg-[#14151A] border border-white/10 opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Step indicator */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold ${
                        isCompleted
                          ? 'bg-emerald-400 text-black'
                          : isActive
                          ? 'bg-white text-black'
                          : isApproval
                          ? 'bg-violet-400 text-black'
                          : 'bg-[#252732] text-slate-400 border border-white/10'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : isActive ? (
                        <Activity className="w-3 h-3" />
                      ) : (
                        step.stepNumber
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                          {step.agentName}
                        </span>
                        {step.metric && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/15 text-slate-300">
                            {step.metric}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 mt-1 font-sans leading-snug">
                        {step.task}
                      </p>

                      <div className="mt-2 p-2 rounded bg-black/60 border border-white/10 text-[11px] font-mono text-slate-300">
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">
                          Output:
                        </span>
                        {step.output}
                      </div>

                      {/* Approval checkpoint */}
                      {isApproval && (
                        <div className="mt-2.5 p-2 rounded bg-violet-400/10 border border-violet-400/30 flex items-center justify-between">
                          <span className="text-xs font-mono text-violet-300 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Requires Merchant Sign-off
                          </span>
                          <button
                            onClick={() => {
                              selectAgent('campaign-strategist');
                              closeWorkflow();
                            }}
                            className="px-2.5 py-1 rounded bg-violet-400 hover:bg-violet-300 text-black text-xs font-mono font-bold"
                          >
                            Review & Authorize
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-white/15 bg-[#17181F] flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">
              Coordinated via Paytm Nexus Event Bus
            </span>
            <button
              onClick={closeWorkflow}
              className="px-3 py-1 rounded bg-[#252732] hover:bg-[#2D303D] text-xs font-mono text-white border border-white/15"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
