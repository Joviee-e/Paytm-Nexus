import React from 'react';
import { Agent } from '../../types/nexus';
import { useNexus } from '../../context/NexusContext';
import {
  Activity,
  CheckCircle2,
  Database,
  ArrowRight,
  Sparkles,
  Shield,
  Layers,
  FileCheck,
} from 'lucide-react';

interface GenericAgentDashboardProps {
  agent: Agent;
}

export const GenericAgentDashboard: React.FC<GenericAgentDashboardProps> = ({ agent }) => {
  const { navigateTo, addToast, selectAgent } = useNexus();

  // Custom action triggers for specific agents
  const renderAgentSpecificAction = () => {
    if (agent.id === 'campaign-strategist') {
      return (
        <button
          onClick={() => navigateTo('approvals')}
          className="px-3.5 py-1.5 rounded-nexus bg-nexus-navy text-white text-xs font-medium flex items-center gap-1.5 shadow-nexus-subtle hover:bg-nexus-navy/90 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-nexus-blue" />
          <span>Review Recovery Campaign in Approvals</span>
        </button>
      );
    }
    if (agent.id === 'churn-predictor') {
      return (
        <button
          onClick={() => selectAgent('customer-segmenter')}
          className="px-3.5 py-1.5 rounded-nexus bg-nexus-navy text-white text-xs font-medium flex items-center gap-1.5 shadow-nexus-subtle hover:bg-nexus-navy/90 transition-all"
        >
          <Layers className="w-3.5 h-3.5 text-nexus-blue" />
          <span>Cross-reference with Customer Segmenter</span>
        </button>
      );
    }
    if (agent.id === 'opportunity-scout') {
      return (
        <button
          onClick={() => selectAgent('campaign-strategist')}
          className="px-3.5 py-1.5 rounded-nexus bg-nexus-navy text-white text-xs font-medium flex items-center gap-1.5 shadow-nexus-subtle hover:bg-nexus-navy/90 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-nexus-blue" />
          <span>Route Opportunity to Campaign Strategist</span>
        </button>
      );
    }
    return (
      <button
        onClick={() => addToast('Task Queued', `${agent.name} queued continuous background evaluation.`, 'success')}
        className="px-3.5 py-1.5 rounded-nexus bg-nexus-navy text-white text-xs font-medium flex items-center gap-1.5 shadow-nexus-subtle hover:bg-nexus-navy/90 transition-all"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-nexus-blue" />
        <span>Run Deep Diagnostic</span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Status Banner */}
      <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-nexus-blue">
              Agent Diagnostic Workspace
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
              Status: {agent.status}
            </span>
          </div>
          <h3 className="text-sm font-bold text-nexus-navy mt-1">{agent.name}</h3>
          <p className="text-xs text-nexus-muted mt-0.5">{agent.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">{renderAgentSpecificAction()}</div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
          <div className="text-xs text-nexus-muted font-medium">Model Confidence</div>
          <div className="text-xl font-bold text-nexus-navy mt-1">{agent.confidenceLevel}%</div>
          <div className="text-[11px] text-nexus-green font-semibold mt-0.5">Verified inference</div>
        </div>

        <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
          <div className="text-xs text-nexus-muted font-medium">Data Feeds Polled</div>
          <div className="text-xl font-bold text-nexus-navy mt-1">{agent.dataSources.length}</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Real-time sync</div>
        </div>

        <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
          <div className="text-xs text-nexus-muted font-medium">Core Capabilities</div>
          <div className="text-xl font-bold text-nexus-navy mt-1">{agent.capabilities.length}</div>
          <div className="text-[11px] text-nexus-blue font-semibold mt-0.5">Autonomous tools</div>
        </div>

        <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
          <div className="text-xs text-nexus-muted font-medium">Telemetry Latency</div>
          <div className="text-xl font-bold text-nexus-navy mt-1">120ms</div>
          <div className="text-[11px] text-nexus-green font-semibold mt-0.5">Sub-second stream</div>
        </div>
      </div>

      {/* Agent Objective & Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 rounded-nexus-lg bg-white border border-nexus-border shadow-nexus-card space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Current Operational Objective
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-nexus border border-nexus-border">
            {agent.objective}
          </p>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">
            Active Task In Progress
          </h4>
          <div className="p-3 rounded-nexus bg-blue-50/50 border border-nexus-blue/20 text-xs text-nexus-navy flex items-start gap-2">
            <Activity className="w-4 h-4 text-nexus-blue shrink-0 mt-0.5" />
            <span>{agent.currentTask}</span>
          </div>
        </div>

        <div className="p-5 rounded-nexus-lg bg-white border border-nexus-border shadow-nexus-card space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Specialized Tool & Analysis Capabilities
          </h4>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.map((cap) => (
              <span
                key={cap}
                className="px-2.5 py-1 bg-nexus-bg text-nexus-navy border border-nexus-border rounded-md text-xs font-medium"
              >
                {cap}
              </span>
            ))}
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">
            Connected Merchant Telemetry Streams
          </h4>
          <div className="space-y-1.5">
            {agent.dataSources.map((ds) => (
              <div
                key={ds}
                className="flex items-center justify-between text-xs p-2 rounded-nexus bg-slate-50 border border-slate-100 text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-nexus-blue" />
                  <span>{ds}</span>
                </div>
                <span className="text-[10px] text-nexus-green font-semibold">Active Stream</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
