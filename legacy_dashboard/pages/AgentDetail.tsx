import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import { Approval } from '../types/nexus';
import { PaymentSentinelDashboard } from '../components/dashboards/PaymentSentinelDashboard';
import { FailureInvestigatorDashboard } from '../components/dashboards/FailureInvestigatorDashboard';
import { SettlementDashboard } from '../components/dashboards/SettlementDashboard';
import { RevenueForecasterDashboard } from '../components/dashboards/RevenueForecasterDashboard';
import { CustomerSegmenterDashboard } from '../components/dashboards/CustomerSegmenterDashboard';
import { ProcessOptimizerDashboard } from '../components/dashboards/ProcessOptimizerDashboard';
import { GenericAgentDashboard } from '../components/dashboards/GenericAgentDashboard';
import { ReasoningModal } from '../components/modals/ReasoningModal';
import {
  Activity,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Database,
  Radio,
  FileText,
} from 'lucide-react';

export const AgentDetail: React.FC = () => {
  const {
    activeAgentId,
    agents,
    selectDepartment,
    agentStreamLogs,
    agentAnalyzing,
    runAgentAnalysis,
    pauseAgentAnalysis,
    clearAgentActivity,
    approvals,
  } = useNexus();

  const [isReasoningOpen, setIsReasoningOpen] = useState(false);

  // Default to payment-sentinel if none active
  const agent = (activeAgentId && agents[activeAgentId]) || agents['payment-sentinel'];
  const logs = agentStreamLogs[agent.id] || [
    { id: '1', timestamp: '09:41:02', text: `${agent.name} initialized telemetry stream.`, type: 'info' },
    { id: '2', timestamp: '09:41:10', text: `Verified live connection with merchant data lake.`, type: 'info' },
  ];
  const isAnalyzing = agentAnalyzing[agent.id] || false;

  // Selected approval for reasoning reference if applicable
  const relatedApproval = approvals.find((a: Approval) => a.agentId === agent.id) || approvals[0];

  const renderDashboard = () => {
    switch (agent.id) {
      case 'payment-sentinel':
        return <PaymentSentinelDashboard />;
      case 'failure-investigator':
        return <FailureInvestigatorDashboard />;
      case 'settlement-investigator':
        return <SettlementDashboard />;
      case 'revenue-forecaster':
        return <RevenueForecasterDashboard />;
      case 'customer-segmenter':
        return <CustomerSegmenterDashboard />;
      case 'process-optimizer':
        return <ProcessOptimizerDashboard />;
      default:
        return <GenericAgentDashboard agent={agent} />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Breadcrumb / Back Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => selectDepartment(agent.departmentId)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-nexus-navy transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {agent.departmentName}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Last updated: {agent.lastUpdate}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="text-xs font-semibold text-nexus-blue">{agent.departmentName}</span>
        </div>
      </div>

      {/* Main Agent Header */}
      <div className="p-6 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-nexus bg-nexus-lightblue/80 border border-nexus-blue/20 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-nexus-blue" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-nexus-blue">
                Specialized Agent Workspace
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  agent.status === 'Active'
                    ? 'bg-emerald-50 text-nexus-green'
                    : agent.status === 'Analyzing'
                    ? 'bg-amber-50 text-nexus-amber'
                    : agent.status === 'Awaiting approval'
                    ? 'bg-purple-50 text-nexus-purple'
                    : 'bg-blue-50 text-nexus-blue'
                }`}
              >
                ● {agent.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-nexus-navy mt-1">{agent.name}</h1>
            <p className="text-xs text-nexus-muted mt-0.5 font-medium">{agent.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsReasoningOpen(true)}
            className="px-3.5 py-2 rounded-nexus bg-white hover:bg-slate-50 border border-nexus-border text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>View Reasoning</span>
          </button>
        </div>
      </div>

      {/* Three-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Agent Summary Card (3 cols)                      */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card space-y-4">
            <span className="text-xs font-bold text-nexus-navy uppercase tracking-wider block pb-2 border-b border-nexus-border">
              Agent Profile
            </span>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Objective
              </span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">{agent.objective}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Current Task
              </span>
              <div className="mt-1 p-2.5 rounded-nexus bg-blue-50/50 border border-nexus-blue/20 text-xs text-nexus-navy font-medium">
                {agent.currentTask}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Monitored Data Sources
              </span>
              <div className="mt-2 space-y-1.5">
                {agent.dataSources.map((ds: string) => (
                  <div
                    key={ds}
                    className="flex items-center gap-2 text-xs p-1.5 rounded-md bg-slate-50 text-slate-700 border border-slate-100"
                  >
                    <Database className="w-3.5 h-3.5 text-nexus-blue shrink-0" />
                    <span className="truncate">{ds}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-nexus-border flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Confidence Level</span>
              <span className="font-bold text-nexus-navy">{agent.confidenceLevel}%</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Last Synchronized</span>
              <span className="text-slate-700 font-medium">{agent.lastUpdate}</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CENTER COLUMN: Tailored Visualizer / Chart Dashboard (6 cols) */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 space-y-6">{renderDashboard()}</div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Live Activity Stream (3 cols)                  */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-nexus-border">
              <div className="flex items-center gap-2">
                <Radio className={`w-3.5 h-3.5 ${isAnalyzing ? 'text-nexus-blue animate-pulse' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-nexus-navy uppercase tracking-wider">
                  Live Activity Stream
                </span>
              </div>
              {isAnalyzing && (
                <span className="text-[10px] font-bold text-nexus-blue bg-nexus-lightblue px-1.5 py-0.2 rounded-full animate-pulse">
                  Streaming
                </span>
              )}
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center gap-1.5">
              {!isAnalyzing ? (
                <button
                  onClick={() => runAgentAnalysis(agent.id)}
                  className="flex-1 py-1.5 px-2 bg-nexus-navy hover:bg-nexus-navy/90 text-white rounded-nexus text-xs font-semibold flex items-center justify-center gap-1 shadow-2xs transition-all"
                >
                  <Play className="w-3 h-3 text-nexus-blue" />
                  <span>Run Analysis</span>
                </button>
              ) : (
                <button
                  onClick={() => pauseAgentAnalysis(agent.id)}
                  className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-nexus-amber border border-amber-300 rounded-nexus text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                >
                  <Pause className="w-3 h-3" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={() => clearAgentActivity(agent.id)}
                className="p-1.5 rounded-nexus hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors border border-slate-200"
                title="Clear activity log"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Streaming Activity Log Entries */}
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {logs.map((item) => {
                let badgeColor = 'bg-slate-100 text-slate-700';
                if (item.type === 'warning') badgeColor = 'bg-amber-100 text-nexus-amber';
                if (item.type === 'action') badgeColor = 'bg-blue-100 text-nexus-blue';
                if (item.type === 'success') badgeColor = 'bg-green-100 text-nexus-green';

                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-nexus bg-slate-50/70 border border-slate-100 space-y-1 text-xs animate-in fade-in slide-in-from-top-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-slate-400">{item.timestamp}</span>
                      <span className={`px-1.5 py-0.2 rounded font-semibold ${badgeColor}`}>
                        {item.type || 'info'}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reasoning Modal for Agent */}
      {isReasoningOpen && (
        <ReasoningModal
          approval={relatedApproval}
          onClose={() => setIsReasoningOpen(false)}
        />
      )}
    </div>
  );
};
