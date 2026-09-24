import React from 'react';
import { useNexus } from '../../context/NexusContext';
import { OPS_EFFICIENCY_DATA } from '../../data/mockData';
import {
  Cpu,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  History,
  Workflow,
  Sparkles,
} from 'lucide-react';

export const ProcessOptimizerDashboard: React.FC = () => {
  const { navigateTo, addToast } = useNexus();

  const recentAutomations = [
    {
      title: 'Self-Healing Gateway Route Retry',
      time: '14 mins ago',
      impact: 'Rerouted 84 failed webhooks with 100% confirmation',
      status: 'Automated',
    },
    {
      title: 'Dispute Evidence Auto-Assembly',
      time: '42 mins ago',
      impact: 'Assembled courier proof-of-delivery for 3 chargeback claims',
      status: 'Automated',
    },
    {
      title: 'Nodal Batch Ledger Auto-Tick',
      time: '1 hour ago',
      impact: 'Balanced 14,280 settlement rows against bank MIS',
      status: 'Automated',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
          <div className="text-xs text-nexus-muted font-medium">Avg Resolution Time</div>
          <div className="text-xl font-bold text-nexus-navy mt-1">9.4 min</div>
          <div className="text-[11px] text-nexus-green font-semibold mt-0.5">↓ 28% this week</div>
        </div>

        <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
          <div className="text-xs text-nexus-muted font-medium">Automations Run (7d)</div>
          <div className="text-xl font-bold text-nexus-navy mt-1">1,840</div>
          <div className="text-[11px] text-nexus-blue font-semibold mt-0.5">100% SLA compliance</div>
        </div>

        <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
          <div className="text-xs text-nexus-muted font-medium">Labor Hours Saved</div>
          <div className="text-xl font-bold text-nexus-navy mt-1">142 hrs</div>
          <div className="text-[11px] text-nexus-green font-semibold mt-0.5">Estimated ₹1.8L savings</div>
        </div>

        <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
          <div className="text-xs text-nexus-muted font-medium">Operational Health</div>
          <div className="text-xl font-bold text-nexus-green mt-1">Optimal</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Zero unhandled backlogs</div>
        </div>
      </div>

      {/* Before AI vs After AI Efficiency Table */}
      <div className="p-5 rounded-nexus-lg bg-white border border-nexus-border shadow-nexus-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-nexus-navy">Before AI vs After AI Resolution Velocity</h3>
            <p className="text-xs text-nexus-muted mt-0.5">
              Autonomous workforce cycle times benchmarked against legacy manual procedures
            </p>
          </div>
          <button
            onClick={() => addToast('Workflow Optimized', 'Process Optimizer tuned auto-triage rules.', 'success')}
            className="px-3 py-1.5 rounded-nexus bg-nexus-navy text-white text-xs font-medium flex items-center gap-1.5 shadow-nexus-subtle hover:bg-nexus-navy/90 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-nexus-blue" />
            <span>Optimize Active Workflows</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-nexus-border text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-2.5">Operational Workflow</th>
                <th className="pb-2.5">Before AI (Manual)</th>
                <th className="pb-2.5">After Nexus AI</th>
                <th className="pb-2.5">Speed Improvement</th>
                <th className="pb-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {OPS_EFFICIENCY_DATA.map((item) => (
                <tr key={item.metric} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 font-semibold text-nexus-navy">{item.metric}</td>
                  <td className="py-3 text-slate-500 line-through">{item.beforeAI}</td>
                  <td className="py-3 font-bold text-nexus-blue">{item.afterAI}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-50 text-nexus-green border border-green-200">
                      ↑ {item.improvement} faster
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-[11px] font-medium text-slate-500">Autonomous</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Autonomous Actions Stream */}
      <div className="p-5 rounded-nexus-lg bg-white border border-nexus-border shadow-nexus-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-nexus-navy">Recent Autonomous Interventions</h3>
          <button
            onClick={() => navigateTo('activity')}
            className="text-xs font-semibold text-nexus-blue hover:underline flex items-center gap-1"
          >
            <span>View Full Workforce Activity</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentAutomations.map((auto) => (
            <div
              key={auto.title}
              className="p-3 rounded-nexus bg-nexus-bg border border-nexus-border flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-white border border-nexus-border flex items-center justify-center text-nexus-blue shadow-2xs">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-nexus-navy">{auto.title}</div>
                  <div className="text-[11px] text-slate-500">{auto.impact}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">{auto.time}</span>
                <span className="text-[10px] font-semibold text-nexus-green">{auto.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
