import React from 'react';
import { useNexus } from '../../context/NexusContext';
import { INVESTIGATION_STEPS } from '../../data/mockData';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  TrendingUp,
  Users,
  UserMinus,
  Compass,
  X,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const InvestigationModal: React.FC = () => {
  const {
    isInvestigationOpen,
    investigationStep,
    investigationRunning,
    investigationPaused,
    investigationComplete,
    pauseInvestigation,
    resumeInvestigation,
    skipInvestigationStep,
    restartInvestigation,
    completeInvestigation,
    closeInvestigation,
    navigateTo,
    addToast,
  } = useNexus();

  if (!isInvestigationOpen) return null;

  const getStepIcon = (agentId: string) => {
    switch (agentId) {
      case 'payment-sentinel':
        return <ShieldAlert className="w-4 h-4 text-nexus-blue" />;
      case 'revenue-forecaster':
        return <TrendingUp className="w-4 h-4 text-nexus-green" />;
      case 'customer-segmenter':
        return <Users className="w-4 h-4 text-nexus-purple" />;
      case 'churn-predictor':
        return <UserMinus className="w-4 h-4 text-nexus-red" />;
      case 'opportunity-scout':
        return <Compass className="w-4 h-4 text-nexus-blue" />;
      case 'campaign-strategist':
        return <Sparkles className="w-4 h-4 text-nexus-purple" />;
      default:
        return <Sparkles className="w-4 h-4 text-nexus-blue" />;
    }
  };

  const currentStepData = INVESTIGATION_STEPS[investigationStep];

  const handleReviewRecommendation = () => {
    closeInvestigation();
    navigateTo('approvals');
    addToast(
      'Recovery Campaign Queued',
      'Directing to Approvals: Review and authorize Recovery Campaign.',
      'info'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-nexus-xl border border-nexus-border shadow-nexus-dropdown overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-nexus-border flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-nexus-navy text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-nexus-blue" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-nexus-blue">
                  Cross-Department Multi-Agent Flow
                </span>
                <span className="text-[10px] bg-nexus-lightblue text-nexus-blue px-2 py-0.5 rounded-full font-bold">
                  Step {investigationStep + 1} of {INVESTIGATION_STEPS.length}
                </span>
              </div>
              <h2 className="text-base font-bold text-nexus-navy">
                Coordinated Revenue Drop Investigation
              </h2>
            </div>
          </div>

          <button
            onClick={closeInvestigation}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Agent Chain Pipeline */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Visual Step Pipeline Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {INVESTIGATION_STEPS.map((step, idx) => {
              const isPast = idx < investigationStep || investigationComplete;
              const isCurrent = idx === investigationStep && !investigationComplete;
              const isUpcoming = idx > investigationStep && !investigationComplete;

              return (
                <div
                  key={step.stepNumber}
                  className={`p-2.5 rounded-nexus border text-center transition-all ${
                    isCurrent
                      ? 'border-nexus-blue ring-2 ring-nexus-blue/20 bg-blue-50/40 shadow-nexus-subtle'
                      : isPast
                      ? 'border-emerald-200 bg-emerald-50/30 text-slate-700'
                      : 'border-slate-200 bg-slate-50/50 opacity-60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center ${
                        isCurrent
                          ? 'bg-nexus-blue text-white shadow-xs'
                          : isPast
                          ? 'bg-nexus-green text-white'
                          : 'bg-white border border-slate-200'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : getStepIcon(step.agentId)}
                    </div>
                  </div>
                  <div className="text-[11px] font-bold truncate text-nexus-navy">
                    {step.agentName}
                  </div>
                  <div className="text-[9px] text-nexus-muted truncate">{step.department}</div>
                </div>
              );
            })}
          </div>

          {/* Active Agent Working Workspace */}
          {!investigationComplete ? (
            <div className="p-5 rounded-nexus-lg bg-nexus-bg border border-nexus-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-nexus-border flex items-center justify-center shadow-xs">
                    {getStepIcon(currentStepData.agentId)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-nexus-navy">
                      {currentStepData.agentName} ({currentStepData.department})
                    </span>
                    <div className="text-[11px] text-nexus-muted">
                      Confidence Level: {currentStepData.confidence}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-blue opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-nexus-blue"></span>
                  </span>
                  <span className="text-xs font-semibold text-nexus-blue">Evaluating...</span>
                </div>
              </div>

              {/* Task description */}
              <div className="p-3 rounded-nexus bg-white border border-nexus-border text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-nexus-navy">Task: </span>
                {currentStepData.task}
              </div>

              {/* Output Result */}
              <div className="p-3.5 rounded-nexus bg-white border border-nexus-blue/30 shadow-nexus-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-nexus-blue">
                    Telemetry Output Finding
                  </span>
                  <span className="text-xs font-bold text-nexus-navy bg-nexus-lightblue px-2 py-0.5 rounded">
                    {currentStepData.metric}
                  </span>
                </div>
                <p className="text-xs font-medium text-nexus-navy leading-relaxed">
                  {currentStepData.output}
                </p>
              </div>
            </div>
          ) : (
            /* Final Completed Synthesis State */
            <div className="p-6 rounded-nexus-lg bg-gradient-to-br from-blue-50/70 to-emerald-50/60 border border-nexus-blue/30 shadow-nexus-card space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-nexus-blue">
                <Sparkles className="w-4 h-4 text-nexus-blue" />
                <span>NEXUS SYNTHESIS COMPLETE</span>
              </div>

              <h3 className="text-base font-bold text-nexus-navy">
                “Revenue decline appears linked to evening payment failures and reduced activity among high-value customers.”
              </h3>

              <div className="p-4 rounded-nexus bg-white border border-nexus-border space-y-2 shadow-nexus-subtle">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Recommended Autonomous Action
                </div>
                <div className="text-sm font-bold text-nexus-navy">
                  “Launch a targeted re-engagement campaign for inactive high-value customers.”
                </div>
                <p className="text-xs text-nexus-muted leading-relaxed">
                  Campaign Strategist formulated a personalized VIP recovery voucher. Projected to recapture ~₹2.8L (12% of lost GMV) with 5.2x estimated ROAS.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={handleReviewRecommendation}
                  className="px-5 py-2.5 rounded-nexus bg-nexus-navy hover:bg-nexus-navy/90 text-white font-semibold text-xs flex items-center gap-2 shadow-nexus-card hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Review Recommendation in Approvals</span>
                  <ArrowRight className="w-4 h-4 text-nexus-blue" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Demo Scenario Bar (Persistent at bottom of modal) */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-nexus-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-nexus-blue" />
            <span className="text-xs font-semibold text-nexus-navy">
              Demo Scenario: Revenue Drop Investigation
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={restartInvestigation}
              className="px-2.5 py-1.5 rounded-nexus bg-white hover:bg-slate-100 border border-nexus-border text-slate-600 text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restart</span>
            </button>

            {investigationRunning ? (
              <button
                onClick={pauseInvestigation}
                className="px-2.5 py-1.5 rounded-nexus bg-white hover:bg-slate-100 border border-nexus-border text-slate-600 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={resumeInvestigation}
                className="px-2.5 py-1.5 rounded-nexus bg-white hover:bg-slate-100 border border-nexus-border text-slate-600 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Play className="w-3 h-3 text-nexus-blue" />
                <span>Resume</span>
              </button>
            )}

            <button
              onClick={skipInvestigationStep}
              disabled={investigationComplete}
              className="px-2.5 py-1.5 rounded-nexus bg-white hover:bg-slate-100 border border-nexus-border text-slate-600 text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-40"
            >
              <SkipForward className="w-3 h-3" />
              <span>Skip Step</span>
            </button>

            <button
              onClick={completeInvestigation}
              className="px-3 py-1.5 rounded-nexus bg-nexus-blue hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
