import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  FileBarChart,
  Download,
  Sparkles,
  TrendingUp,
  CreditCard,
  Scale,
  Cpu,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { addToast } = useNexus();
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string>('Today at 22:30');

  const handleGenerateReport = () => {
    setIsGenerating(true);
    addToast('Compiling Briefing', 'Querying 20 agent nodes for store-wide synthesis...', 'info');

    setTimeout(() => {
      setIsGenerating(false);
      const timeStr = `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      setLastGenerated(timeStr);
      addToast('Report Ready', 'Executive Merchant Intelligence Digest generated.', 'success');
    }, 1800);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-nexus-lightblue text-nexus-blue border border-nexus-blue/20 text-xs font-semibold mb-2">
            <FileBarChart className="w-3.5 h-3.5" />
            <span>Executive Synthesis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-nexus-navy tracking-tight">
            Merchant Intelligence Briefing
          </h1>
          <p className="text-sm text-nexus-muted mt-1 font-normal">
            Unified cross-department operational digest compiled by Decision Support Agent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => addToast('Export Queued', 'Downloading PDF executive summary...', 'info')}
            className="px-3 py-2 rounded-nexus bg-white hover:bg-slate-50 border border-nexus-border text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-4 py-2 rounded-nexus bg-nexus-navy hover:bg-nexus-navy/90 text-white text-xs font-semibold flex items-center gap-2 shadow-nexus-subtle transition-all disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-nexus-blue" />
                <span>Generate Fresh Briefing</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Briefing Meta Pill */}
      <div className="flex items-center justify-between p-3 rounded-nexus bg-white border border-nexus-border text-xs text-nexus-muted">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-nexus-blue" />
          <span>Last compiled: <strong className="text-nexus-navy">{lastGenerated}</strong></span>
        </div>
        <div className="flex items-center gap-1 text-nexus-green font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Agent Consensus Verified</span>
        </div>
      </div>

      {/* Cross-Department Executive Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card">
          <div className="flex items-center justify-between text-xs text-nexus-muted">
            <span>Payment Conversion</span>
            <CreditCard className="w-4 h-4 text-nexus-blue" />
          </div>
          <div className="text-2xl font-bold text-nexus-navy mt-2">94.2%</div>
          <div className="text-xs text-nexus-red mt-1 font-semibold">↓ 3.1% (Evening drop)</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Payment Sentinel flagged UPI switch anomaly between 19:00 - 22:00.
          </p>
        </div>

        <div className="p-5 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card">
          <div className="flex items-center justify-between text-xs text-nexus-muted">
            <span>Settlement Health</span>
            <Scale className="w-4 h-4 text-nexus-navy" />
          </div>
          <div className="text-2xl font-bold text-nexus-navy mt-2">99.4%</div>
          <div className="text-xs text-nexus-green mt-1 font-semibold">↑ Auto-matched</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            31 timing items balanced; 1 ₹150 fee waiver awaiting merchant approval.
          </p>
        </div>

        <div className="p-5 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card">
          <div className="flex items-center justify-between text-xs text-nexus-muted">
            <span>Projected Growth</span>
            <TrendingUp className="w-4 h-4 text-nexus-green" />
          </div>
          <div className="text-2xl font-bold text-nexus-navy mt-2">+18.4%</div>
          <div className="text-xs text-nexus-blue mt-1 font-semibold">MoM Run-rate</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            ₹2.8L recoverable GMV through targeted VIP customer campaign.
          </p>
        </div>

        <div className="p-5 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card">
          <div className="flex items-center justify-between text-xs text-nexus-muted">
            <span>Operational Resolution</span>
            <Cpu className="w-4 h-4 text-nexus-purple" />
          </div>
          <div className="text-2xl font-bold text-nexus-navy mt-2">9.4 min</div>
          <div className="text-xs text-nexus-green mt-1 font-semibold">↓ 28% faster</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            1,840 autonomous workflow automations executed with zero errors.
          </p>
        </div>
      </div>

      {/* Strategic Synthesis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Executive Action Recommendations */}
        <div className="p-6 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card space-y-4">
          <h3 className="text-sm font-bold text-nexus-navy uppercase tracking-wider">
            Prioritized Merchant Directives
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-nexus bg-blue-50/50 border border-nexus-blue/20 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-nexus-navy">
                <span>1. Authorize High-Value VIP Recovery Campaign</span>
                <span className="text-nexus-blue">High Priority</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Approve the ₹25k incentive campaign designed by Campaign Strategist to recapture 1,420 dropped-off repeat buyers.
              </p>
            </div>

            <div className="p-3.5 rounded-nexus bg-slate-50 border border-nexus-border space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-nexus-navy">
                <span>2. Enable UPI Dynamic Fallback Route</span>
                <span className="text-nexus-amber">Ready in Control Layer</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Permit secondary switch routing for peak hours to prevent repeated evening failure spikes.
              </p>
            </div>

            <div className="p-3.5 rounded-nexus bg-slate-50 border border-nexus-border space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-nexus-navy">
                <span>3. Sign Off On ₹150 Nodal Fee Rounding Waiver</span>
                <span className="text-nexus-green">Unblocks ₹14.8L</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Authorizing the micro-discrepancy permits automatic release of today’s main settlement batch.
              </p>
            </div>
          </div>
        </div>

        {/* 7-Day Performance Digest */}
        <div className="p-6 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card space-y-4">
          <h3 className="text-sm font-bold text-nexus-navy uppercase tracking-wider">
            Workforce Health & Safety Compliance
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-nexus bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-nexus-green" />
                <span className="font-semibold text-nexus-navy">RBI Tokenization Directive</span>
              </div>
              <span className="text-nexus-green font-bold">100% Compliant</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-nexus bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-nexus-green" />
                <span className="font-semibold text-nexus-navy">GST e-Invoice Hash Verification</span>
              </div>
              <span className="text-nexus-green font-bold">Verified</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-nexus bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-nexus-green" />
                <span className="font-semibold text-nexus-navy">Nodal Account Settlement Balance</span>
              </div>
              <span className="text-nexus-blue font-bold">Reconciled</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-nexus bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-nexus-green" />
                <span className="font-semibold text-nexus-navy">Merchant Discretion Guarantee</span>
              </div>
              <span className="text-nexus-navy font-bold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
