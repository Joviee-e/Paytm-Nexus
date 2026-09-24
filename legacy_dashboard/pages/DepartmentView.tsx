import React from 'react';
import { useNexus } from '../context/NexusContext';
import { DepartmentId, Department, Agent } from '../types/nexus';
import {
  CreditCard,
  Scale,
  TrendingUp,
  Users,
  Layers,
  ArrowRight,
  Activity,
  Play,
} from 'lucide-react';

export const DepartmentView: React.FC = () => {
  const {
    departments,
    agents,
    activeDepartmentId,
    selectDepartment,
    selectAgent,
    addToast,
  } = useNexus();

  // If no department is active, default to payment-ops
  const currentDeptId: DepartmentId = activeDepartmentId || 'payment-ops';
  const dept: Department = departments.find((d: Department) => d.id === currentDeptId) || departments[0];

  const deptAgents: Agent[] = dept.agentIds.map((id: string) => agents[id]).filter(Boolean);

  const getDeptIcon = (id: DepartmentId) => {
    switch (id) {
      case 'payment-ops':
        return <CreditCard className="w-5 h-5 text-nexus-blue" />;
      case 'finance-recon':
        return <Scale className="w-5 h-5 text-nexus-navy" />;
      case 'merchant-growth':
        return <TrendingUp className="w-5 h-5 text-nexus-green" />;
      case 'customer-intel':
        return <Users className="w-5 h-5 text-nexus-purple" />;
      case 'biz-ops':
        return <Layers className="w-5 h-5 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Department Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-nexus-border">
        {departments.map((d: Department) => {
          const isActive = d.id === dept.id;
          return (
            <button
              key={d.id}
              onClick={() => selectDepartment(d.id)}
              className={`px-4 py-2 rounded-nexus text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-nexus-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-nexus-navy hover:bg-slate-100'
              }`}
            >
              <span>{d.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-nexus-blue text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                4
              </span>
            </button>
          );
        })}
      </div>

      {/* Department Hero Banner */}
      <div className="p-6 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-nexus bg-nexus-lightblue/70 border border-nexus-blue/20 flex items-center justify-center shrink-0">
              {getDeptIcon(dept.id)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-nexus-blue">
                  Department Intelligence Hub
                </span>
                <span className="text-[10px] bg-emerald-50 text-nexus-green px-2 py-0.5 rounded-full font-bold">
                  {dept.status}
                </span>
              </div>
              <h1 className="text-xl font-bold text-nexus-navy mt-1">{dept.name}</h1>
              <p className="text-sm text-nexus-muted mt-0.5 font-medium">“{dept.descriptor}”</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                addToast('Department Analysis Run', `Initiated automated scan for all 4 agents in ${dept.name}.`, 'info');
              }}
              className="px-3.5 py-2 rounded-nexus bg-nexus-navy hover:bg-nexus-navy/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-nexus-subtle transition-all"
            >
              <Play className="w-3.5 h-3.5 text-nexus-blue" />
              <span>Run Department Analysis</span>
            </button>
          </div>
        </div>

        {/* Priority & Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-nexus bg-nexus-bg border border-nexus-border">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Current Priority
            </div>
            <div className="text-xs font-bold text-nexus-navy mt-1 leading-snug">
              {dept.priority}
            </div>
          </div>

          <div className="p-3.5 rounded-nexus bg-nexus-bg border border-nexus-border">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Active Finding
            </div>
            <div className="text-xs font-semibold text-nexus-navy mt-1 leading-snug">
              {dept.finding}
            </div>
          </div>

          <div className="p-3.5 rounded-nexus bg-nexus-bg border border-nexus-border">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Recommended Next Action
            </div>
            <div className="text-xs font-semibold text-nexus-blue mt-1 leading-snug">
              {dept.recommendedAction}
            </div>
          </div>
        </div>

        {/* Capabilities Pill Strip */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1">Core Capabilities:</span>
          {dept.capabilities.map((cap: string) => (
            <span
              key={cap}
              className="px-2.5 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700 font-medium"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>

      {/* 4 Specialized Workforce Agents in this Department */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-nexus-navy">
              Specialized Agents ({deptAgents.length})
            </h2>
            <p className="text-xs text-nexus-muted">
              Click any agent to inspect live telemetry, data sources, and activity stream
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deptAgents.map((agent: Agent) => (
            <div
              key={agent.id}
              onClick={() => selectAgent(agent.id)}
              className="p-5 rounded-nexus-xl bg-white border border-nexus-border hover:border-nexus-blue/50 shadow-nexus-card hover:shadow-nexus-hover transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-nexus bg-nexus-bg border border-nexus-border flex items-center justify-center text-nexus-blue shadow-2xs group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5 text-nexus-blue" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        agent.status === 'Active'
                          ? 'bg-nexus-green animate-pulse'
                          : agent.status === 'Analyzing'
                          ? 'bg-nexus-amber animate-pulse'
                          : agent.status === 'Awaiting approval'
                          ? 'bg-nexus-purple'
                          : 'bg-nexus-blue'
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-600">{agent.status}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-nexus-navy mt-3 group-hover:text-nexus-blue transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs text-nexus-muted mt-0.5 line-clamp-1">{agent.subtitle}</p>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-nexus border border-slate-100">
                  {agent.objective}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Confidence: {agent.confidenceLevel}%</span>
                <div className="flex items-center gap-1 text-nexus-blue font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Open Agent Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
