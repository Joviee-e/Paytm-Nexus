import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexus } from '../../context/NexusContext';
import {
  X,
  Play,
  Check,
  AlertTriangle,
  Clock,
  Sparkles,
  Database,
  BrainCircuit,
  ShieldCheck,
  Activity,
  FileCheck,
  Terminal,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  FileText,
  Copy,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const AgentWorkspace: React.FC = () => {
  const {
    activeAgent,
    activeDepartment,
    returnToWorkforceMap,
    runAgentDiagnosis,
    diagnosingAgentIds,
    agentDiagnosticLogs,
    approveAgentAction,
    rejectAgentAction,
  } = useNexus();

  const [activeTab, setActiveTab] = useState<'spec' | 'reports' | 'intelligence' | 'actions'>('spec');
  const [copiedReport, setCopiedReport] = useState(false);

  if (!activeAgent || !activeDepartment) return null;

  const isDiagnosing = diagnosingAgentIds[activeAgent.id] || false;
  const diagnosticLogs = agentDiagnosticLogs[activeAgent.id] || [];

  const handleCopyReport = () => {
    const reportText = `[Paytm Nexus Intelligence Report]\nAgent: ${activeAgent.name}\nDepartment: ${activeDepartment.name}\nStatus: ${activeAgent.status}\nCurrent Task: ${activeAgent.currentTask}\nFindings: \n${(activeAgent.evidence || []).map((e) => `• ${e}`).join('\n')}\nRecommended Action: ${activeAgent.recommendedAction?.title || 'None'}`;
    navigator.clipboard?.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-y-0 right-0 z-50 flex pointer-events-none select-text">
        {/* Subtle backdrop overlay for focus on small screens */}
        <motion.div
          className="fixed inset-0 bg-black/40 md:hidden pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={returnToWorkforceMap}
        />

        {/* Solid Greasy-Black Inspector Panel */}
        <motion.div
          className="relative pointer-events-auto w-full md:w-[480px] lg:w-[520px] h-full flex flex-col bg-[#141519] border-l border-white/20 shadow-[-20px_0_40px_rgba(0,0,0,0.8)] text-slate-100 overflow-hidden"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        >
          {/* Top Inspector Header */}
          <div className="px-5 py-4 border-b border-white/15 bg-[#17181E] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase text-slate-400">
                Paytm Nexus
              </span>
              <span className="text-slate-600 text-xs">/</span>
              <span className="text-[11px] font-mono uppercase text-slate-300">
                {activeDepartment.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Indicator */}
              <div
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                  activeAgent.status === 'attention'
                    ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                    : activeAgent.status === 'awaiting_approval'
                    ? 'bg-violet-400/10 border-violet-400 text-violet-300'
                    : activeAgent.status === 'working'
                    ? 'bg-sky-400/10 border-sky-400 text-sky-300'
                    : activeAgent.status === 'completed'
                    ? 'bg-emerald-400/10 border-emerald-400 text-emerald-400'
                    : 'bg-white/5 border-white/20 text-slate-400'
                }`}
              >
                {activeAgent.status.replace('_', ' ')}
              </div>

              {/* Close Button */}
              <button
                onClick={returnToWorkforceMap}
                className="w-7 h-7 rounded-lg bg-[#22242C] border border-white/15 hover:border-white/40 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Close Inspector (ESC)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Agent Identity Banner */}
          <div className="px-5 py-4 border-b border-white/10 bg-[#15161C] shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-white font-mono">
                {activeAgent.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/15 text-slate-400">
                ID: {activeAgent.id}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {activeAgent.subtitle}
            </p>

            {/* Segmented Solid Tab Control */}
            <div className="grid grid-cols-4 gap-1 mt-4 p-1 rounded-lg bg-[#111216] border border-white/10 text-[11px] font-mono font-semibold">
              <button
                onClick={() => setActiveTab('spec')}
                className={`py-1.5 rounded transition-all text-center ${
                  activeTab === 'spec'
                    ? 'bg-[#262832] text-white border border-white/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Spec
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-1.5 rounded transition-all text-center ${
                  activeTab === 'reports'
                    ? 'bg-[#262832] text-white border border-white/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setActiveTab('intelligence')}
                className={`py-1.5 rounded transition-all text-center ${
                  activeTab === 'intelligence'
                    ? 'bg-[#262832] text-white border border-white/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Model
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`py-1.5 rounded transition-all text-center ${
                  activeTab === 'actions'
                    ? 'bg-[#262832] text-white border border-white/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Actions
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* ========================================================== */}
            {/* TAB 1: SPECIFICATION & ROLE */}
            {/* ========================================================== */}
            {activeTab === 'spec' && (
              <div className="space-y-4">
                {/* Mission / Objective Card */}
                <div className="p-3.5 rounded-xl bg-[#1A1B22] border border-white/15">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    System Purpose & Objective
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {activeAgent.description}
                  </p>
                </div>

                {/* What it replaces (SkillTree style) */}
                <div className="p-3.5 rounded-xl bg-[#1A1B22] border border-white/15">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Replaces Manual Workflow
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Automates continuous 24/7 telemetry analysis, eliminating 15+ hours/week of manual spreadsheet reconciliation, bank switch status checks, and customer complaint triage.
                  </p>
                </div>

                {/* Capabilities */}
                <div className="p-3.5 rounded-xl bg-[#1A1B22] border border-white/15">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
                    Core Capabilities ({activeAgent.capabilities.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeAgent.capabilities.map((cap, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-1 rounded bg-[#252732] border border-white/15 text-slate-200"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Connected Data Sources */}
                <div className="p-3.5 rounded-xl bg-[#1A1B22] border border-white/15">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-slate-300" />
                    Ingested Data Feeds
                  </span>
                  <div className="space-y-1.5">
                    {activeAgent.dataSources.map((ds, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded bg-[#20222A] border border-white/10"
                      >
                        <span className="font-mono text-slate-300 text-[11px]">{ds}</span>
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Live Stream
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 2: REPORTS & FINDINGS */}
            {/* ========================================================== */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                {/* Active Alert / Finding Banner */}
                {activeAgent.alertSignal && (
                  <div className="p-3.5 rounded-xl bg-[#231F17] border border-amber-400/60">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold uppercase mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Critical Signal Detected
                    </div>
                    <p className="text-xs text-amber-200 font-sans leading-relaxed">
                      {activeAgent.alertSignal}
                    </p>
                  </div>
                )}

                {/* Empirical Evidence Findings List */}
                <div className="p-3.5 rounded-xl bg-[#1A1B22] border border-white/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      Telemetry Evidence Log
                    </span>
                    <button
                      onClick={handleCopyReport}
                      className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedReport ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(activeAgent.evidence && activeAgent.evidence.length > 0
                      ? activeAgent.evidence
                      : [
                          'Transaction telemetry normal across all payment switches',
                          'No latency spikes exceeding 30-day baseline threshold',
                          'Error code frequency stable within nominal distribution',
                        ]
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-200 p-2 rounded bg-[#20222A] border border-white/10"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-1.5" />
                        <span className="font-sans leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Telemetry Metrics Table */}
                {activeAgent.intelligence?.metrics && (
                  <div className="p-3.5 rounded-xl bg-[#1A1B22] border border-white/15">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
                      Key Performance Metrics
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {activeAgent.intelligence.metrics.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded bg-[#20222A] border border-white/10"
                        >
                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            {m.label}
                          </div>
                          <div className="text-base font-bold font-mono text-white mt-0.5">
                            {m.value}
                          </div>
                          {m.change && (
                            <div
                              className={`text-[10px] font-mono mt-0.5 ${
                                m.isPositive
                                  ? 'text-emerald-400'
                                  : m.isPositive === false
                                  ? 'text-rose-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              {m.change}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 3: MODEL & INTELLIGENCE */}
            {/* ========================================================== */}
            {activeTab === 'intelligence' && (
              <div className="space-y-4">
                {/* Model Architecture */}
                <div className="p-3.5 rounded-xl bg-[#1A1B22] border border-white/15">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                    Analytical Model Architecture
                  </span>
                  <div className="text-sm font-bold font-mono text-white">
                    {activeAgent.intelligence?.model || 'Adaptive Bayesian Time-Series Pipeline'}
                  </div>
                  {activeAgent.intelligence?.benchmarkComparison && (
                    <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
                      {activeAgent.intelligence.benchmarkComparison}
                    </p>
                  )}
                </div>

                {/* Model Reliability & Confidence Score */}
                <div className="p-3.5 rounded-xl bg-[#1A1B22] border border-white/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      Model Reliability Score
                    </span>
                    <span className="text-sm font-mono font-bold text-white">
                      {activeAgent.intelligence?.confidence || 96}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#252732] overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${activeAgent.intelligence?.confidence || 96}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-2">
                    Calibrated against 100,000+ historical merchant transactions.
                  </span>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 4: RUNNABLE ACTIONS & LIVE STREAM */}
            {/* ========================================================== */}
            {activeTab === 'actions' && (
              <div className="space-y-4">
                {/* Merchant Recommendation Box */}
                {activeAgent.recommendedAction && (
                  <div className="p-3.5 rounded-xl bg-[#1C1F28] border border-white/25">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-white">
                        Recommended Action
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 border border-white/15 text-slate-300">
                        {activeAgent.recommendedAction.impact}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white font-mono mt-1">
                      {activeAgent.recommendedAction.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                      {activeAgent.recommendedAction.description}
                    </p>

                    {/* Action buttons */}
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                      {activeAgent.status === 'awaiting_approval' ? (
                        <>
                          <button
                            onClick={() => approveAgentAction(activeAgent.id)}
                            className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-black font-bold font-mono text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve Action
                          </button>
                          <button
                            onClick={() => rejectAgentAction(activeAgent.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#252732] hover:bg-[#2D303D] text-slate-300 font-mono text-xs transition-colors border border-white/15"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => runAgentDiagnosis(activeAgent.id)}
                          disabled={isDiagnosing}
                          className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-black font-bold font-mono text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          {isDiagnosing ? 'Running Telemetry Sweep...' : 'Run Diagnostic Audit'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Live Diagnostic Console Stream */}
                <div className="p-3 rounded-xl bg-black border border-white/15 font-mono text-[11px]">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-white" />
                      Live Agent Telemetry Stream
                    </span>
                    <span>{isDiagnosing ? 'Active' : 'Idle'}</span>
                  </div>

                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                    {diagnosticLogs.length === 0 ? (
                      <div className="text-slate-500 py-4 text-center">
                        Click "Run Diagnostic Audit" above to stream live telemetry.
                      </div>
                    ) : (
                      diagnosticLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-2">
                          <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                          <span
                            className={
                              log.type === 'warning'
                                ? 'text-amber-300'
                                : log.type === 'success'
                                ? 'text-emerald-300'
                                : 'text-slate-300'
                            }
                          >
                            {log.text}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Footer Actions */}
          <div className="px-5 py-3 border-t border-white/15 bg-[#17181E] flex items-center justify-between shrink-0">
            <span className="text-[10px] font-mono text-slate-400">
              ESC to return to canvas
            </span>
            <button
              onClick={returnToWorkforceMap}
              className="px-3.5 py-1.5 rounded-lg bg-[#252732] hover:bg-[#2D303D] text-xs font-mono font-semibold text-white transition-colors border border-white/20"
            >
              Return to Map
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
