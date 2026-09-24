import React from 'react';
import { useNexus } from '../context/NexusContext';
import { IntelligenceGraph } from '../components/graph/IntelligenceGraph';
import { DepartmentId, LiveInsight } from '../types/nexus';
import {
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const NexusHome: React.FC = () => {
  const {
    liveInsights,
    selectInsight,
    startInvestigation,
    approvals,
    navigateTo,
    selectDepartment,
    activeDepartmentId,
    activeDepartment,
    selectAgent,
  } = useNexus();

  const pendingApprovalsCount = approvals.filter(
    (a) => a.status === 'Awaiting merchant approval'
  ).length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-nexus-lightblue text-nexus-blue border border-nexus-blue/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Merchant Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-nexus-navy tracking-tight">
            Your business, connected.
          </h1>
          <p className="text-sm text-nexus-muted mt-1 font-normal">
            One intelligence layer. Every important decision.
          </p>
        </div>

        {/* Action Button: Start Cross-Department Investigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={startInvestigation}
            className="px-4 py-2 rounded-nexus bg-nexus-navy hover:bg-nexus-navy/90 text-white text-xs font-semibold shadow-nexus-card flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-nexus-blue" />
            <span>Investigate revenue drop</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Graph + Nexus at a Glance */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Central Intelligence Graph (3 columns on large screens) */}
        <div className="xl:col-span-3">
          <IntelligenceGraph />
        </div>

        {/* Right-Side Panel: "Nexus at a glance" */}
        <div className="space-y-4">
          <div className="p-5 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card">
            <div className="flex items-center justify-between pb-3 border-b border-nexus-border">
              <span className="text-xs font-bold text-nexus-navy uppercase tracking-wider">
                Nexus at a glance
              </span>
              <span className="w-2 h-2 rounded-full bg-nexus-green animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div
                onClick={() => navigateTo('departments')}
                className="p-3 rounded-nexus bg-nexus-bg border border-nexus-border hover:border-nexus-blue/40 cursor-pointer transition-all"
              >
                <div className="text-[11px] text-nexus-muted font-medium">Active Agents</div>
                <div className="text-xl font-bold text-nexus-navy mt-0.5">20</div>
                <div className="text-[10px] text-nexus-green font-semibold mt-0.5">5 Departments</div>
              </div>

              <div
                onClick={() => navigateTo('activity')}
                className="p-3 rounded-nexus bg-nexus-bg border border-nexus-border hover:border-nexus-blue/40 cursor-pointer transition-all"
              >
                <div className="text-[11px] text-nexus-muted font-medium">Insights Generated</div>
                <div className="text-xl font-bold text-nexus-navy mt-0.5">42</div>
                <div className="text-[10px] text-nexus-blue font-semibold mt-0.5">Real-time sync</div>
              </div>

              <div
                onClick={() => navigateTo('approvals')}
                className="p-3 rounded-nexus bg-nexus-bg border border-nexus-border hover:border-nexus-blue/40 cursor-pointer transition-all"
              >
                <div className="text-[11px] text-nexus-muted font-medium">Awaiting Approval</div>
                <div className="text-xl font-bold text-nexus-amber mt-0.5">{pendingApprovalsCount}</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Control layer ready</div>
              </div>

              <div
                onClick={() => navigateTo('activity')}
                className="p-3 rounded-nexus bg-nexus-bg border border-nexus-border hover:border-nexus-blue/40 cursor-pointer transition-all"
              >
                <div className="text-[11px] text-nexus-muted font-medium">Issues Detected</div>
                <div className="text-xl font-bold text-nexus-navy mt-0.5">7</div>
                <div className="text-[10px] text-nexus-green font-semibold mt-0.5">6 Auto-mitigated</div>
              </div>
            </div>

            {/* Quick Demo Shortcut Card */}
            <div className="mt-4 p-3.5 rounded-nexus bg-gradient-to-br from-nexus-lightblue to-blue-50/40 border border-nexus-blue/20">
              <div className="flex items-center gap-1.5 text-xs font-bold text-nexus-navy">
                <Sparkles className="w-3.5 h-3.5 text-nexus-blue" />
                <span>Featured Demo Workflow</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Click “Investigate revenue drop” to watch 6 specialized agents collaborate across departments in real time.
              </p>
              <button
                onClick={startInvestigation}
                className="mt-2 text-xs font-semibold text-nexus-blue hover:underline flex items-center gap-1"
              >
                <span>Launch Multi-Agent Demo</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Department Switcher */}
          <div className="p-4 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card">
            <span className="text-xs font-bold text-nexus-navy uppercase tracking-wider block mb-3">
              Explore Departments
            </span>
            <div className="space-y-1.5">
              {[
                { id: 'payment-ops', name: 'Payment Operations', agents: 4 },
                { id: 'finance-recon', name: 'Finance & Reconciliation', agents: 4 },
                { id: 'merchant-growth', name: 'Merchant Growth', agents: 4 },
                { id: 'customer-intel', name: 'Customer Intelligence', agents: 4 },
                { id: 'biz-ops', name: 'Business Operations', agents: 4 },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => selectDepartment(d.id as DepartmentId)}
                  className={`w-full flex items-center justify-between p-2 rounded-nexus text-xs transition-all text-left ${
                    activeDepartmentId === d.id
                      ? 'bg-nexus-lightblue text-nexus-navy font-semibold border border-nexus-blue/30'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{d.name}</span>
                  <span className="text-[10px] text-nexus-blue">{d.agents} agents</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Department Overview Banner (Shown below graph when a department is active) */}
      {activeDepartment && (
        <div className="p-5 rounded-nexus-xl bg-white border border-nexus-blue/40 shadow-nexus-dropdown space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-nexus-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-nexus-blue">
                  Selected Department Hub
                </span>
                <span className="text-[10px] bg-emerald-50 text-nexus-green px-2 py-0.5 rounded-full font-bold">
                  {activeDepartment.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-nexus-navy mt-0.5">
                {activeDepartment.name} — &quot;{activeDepartment.descriptor}&quot;
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTo('departments', activeDepartment.id)}
                className="px-3 py-1.5 rounded-nexus bg-white hover:bg-slate-50 border border-nexus-border text-slate-700 text-xs font-medium"
              >
                View Department Hub
              </button>
              <button
                onClick={() => selectAgent(activeDepartment.agentIds[0])}
                className="px-3.5 py-1.5 rounded-nexus bg-nexus-navy hover:bg-nexus-navy/90 text-white text-xs font-semibold shadow-nexus-subtle"
              >
                Open Primary Agent
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-nexus bg-nexus-bg border border-nexus-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Current Priority
              </span>
              <div className="font-semibold text-nexus-navy mt-1">{activeDepartment.priority}</div>
            </div>

            <div className="p-3 rounded-nexus bg-nexus-bg border border-nexus-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active Telemetry Finding
              </span>
              <div className="font-semibold text-nexus-navy mt-1">{activeDepartment.finding}</div>
            </div>

            <div className="p-3 rounded-nexus bg-nexus-bg border border-nexus-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Recommended Action
              </span>
              <div className="font-semibold text-nexus-blue mt-1">{activeDepartment.recommendedAction}</div>
            </div>
          </div>
        </div>
      )}

      {/* Live Intelligence Summary Panel */}
      <div className="p-6 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-nexus-blue">
                Live Intelligence Summary
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                Click any insight to open agent
              </span>
            </div>
            <h3 className="text-sm font-bold text-nexus-navy mt-0.5">
              Real-time cross-department findings requiring merchant awareness
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {liveInsights.map((insight: LiveInsight) => {
            let Icon = Info;
            let iconColor = 'text-nexus-blue';
            let borderColor = 'border-nexus-border';
            let bgHover = 'hover:border-nexus-blue/40';

            if (insight.severity === 'warning') {
              Icon = AlertTriangle;
              iconColor = 'text-nexus-amber';
            } else if (insight.severity === 'opportunity') {
              Icon = TrendingUp;
              iconColor = 'text-nexus-blue';
            } else if (insight.severity === 'success') {
              Icon = CheckCircle2;
              iconColor = 'text-nexus-green';
            }

            return (
              <div
                key={insight.id}
                onClick={() => selectInsight(insight)}
                className={`p-3.5 rounded-nexus border ${borderColor} ${bgHover} bg-white hover:shadow-nexus-hover transition-all cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        {insight.departmentName}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                      {insight.metric}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-nexus-navy mt-2 group-hover:text-nexus-blue transition-colors line-clamp-2 leading-relaxed">
                    {insight.title}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-nexus-muted">
                  <span>Agent: {insight.agentName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-nexus-blue group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand Sign-off Footer Banner */}
      <div className="text-center py-4 border-t border-nexus-border text-xs text-nexus-muted font-medium">
        <span>One merchant. One intelligent interface. One coordinated workforce.</span>
      </div>
    </div>
  );
};
