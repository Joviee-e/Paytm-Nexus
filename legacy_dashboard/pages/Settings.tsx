import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import {
  Settings as SettingsIcon,
  Sliders,
  Save,
  Database,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { addToast } = useNexus();

  const [autoApproveMicroDiscrepancies, setAutoApproveMicroDiscrepancies] = useState(true);
  const [requireSignoffForCampaigns, setRequireSignoffForCampaigns] = useState(true);
  const [instantFailoverThreshold, setInstantFailoverThreshold] = useState('12%');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Settings Saved', 'Nexus autonomy thresholds and merchant preferences updated.', 'success');
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-nexus-lightblue text-nexus-blue border border-nexus-blue/20 text-xs font-semibold mb-2">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Control Layer Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-nexus-navy tracking-tight">
          Merchant Settings & Autonomy Rules
        </h1>
        <p className="text-sm text-nexus-muted mt-1 font-normal">
          Configure how much autonomy Nexus agents exercise and define human approval boundaries.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Autonomy & Governance Thresholds */}
        <div className="p-6 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-nexus-border">
            <Sliders className="w-4 h-4 text-nexus-blue" />
            <h3 className="text-sm font-bold text-nexus-navy uppercase tracking-wider">
              Autonomous Execution Guardrails
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-nexus bg-nexus-bg border border-nexus-border">
              <div>
                <div className="font-semibold text-nexus-navy">Auto-resolve Nodal Micro-Discrepancies</div>
                <div className="text-slate-500 mt-0.5">
                  Allow Settlement Investigator to auto-balance discrepancies below ₹500
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoApproveMicroDiscrepancies}
                onChange={(e) => setAutoApproveMicroDiscrepancies(e.target.checked)}
                className="w-4 h-4 text-nexus-blue rounded border-slate-300 focus:ring-nexus-blue"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-nexus bg-nexus-bg border border-nexus-border">
              <div>
                <div className="font-semibold text-nexus-navy">Mandatory Merchant Approval on Marketing Budgets</div>
                <div className="text-slate-500 mt-0.5">
                  Always require human review before Campaign Strategist queues paid messages
                </div>
              </div>
              <input
                type="checkbox"
                checked={requireSignoffForCampaigns}
                onChange={(e) => setRequireSignoffForCampaigns(e.target.checked)}
                className="w-4 h-4 text-nexus-blue rounded border-slate-300 focus:ring-nexus-blue"
              />
            </div>

            <div className="p-3 rounded-nexus bg-nexus-bg border border-nexus-border space-y-2">
              <label className="block font-semibold text-nexus-navy">
                Payment Gateway Auto-Failover Failure Rate Trigger
              </label>
              <select
                value={instantFailoverThreshold}
                onChange={(e) => setInstantFailoverThreshold(e.target.value)}
                className="w-full sm:w-64 px-3 py-1.5 rounded-nexus border border-nexus-border bg-white text-xs text-nexus-navy focus:outline-none focus:border-nexus-blue"
              >
                <option value="8%">8% failure rate (Ultra-sensitive)</option>
                <option value="12%">12% failure rate (Recommended)</option>
                <option value="18%">18% failure rate (Conservative)</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Payment Sentinel will immediately reroute transactions if switch failure exceeds this threshold.
              </p>
            </div>
          </div>
        </div>

        {/* Connected Ecosystem Status */}
        <div className="p-6 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-nexus-border">
            <Database className="w-4 h-4 text-nexus-blue" />
            <h3 className="text-sm font-bold text-nexus-navy uppercase tracking-wider">
              Connected Merchant Infrastructure
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { name: 'Paytm Payment Gateway API', status: 'Connected', latency: '42ms' },
              { name: 'NPCI National Switch Feed', status: 'Connected', latency: '120ms' },
              { name: 'Merchant ERP & Tally Bridge', status: 'Active Sync', latency: 'Every 15m' },
              { name: 'WhatsApp Business API Gateway', status: 'Connected', latency: 'Real-time' },
            ].map((infra) => (
              <div
                key={infra.name}
                className="p-3 rounded-nexus bg-slate-50 border border-slate-200/80 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-nexus-navy">{infra.name}</div>
                  <div className="text-[10px] text-slate-500">Latency: {infra.latency}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-nexus-green border border-emerald-200">
                  {infra.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded-nexus bg-nexus-navy hover:bg-nexus-navy/90 text-white font-semibold text-xs flex items-center gap-1.5 shadow-nexus-subtle transition-all"
          >
            <Save className="w-3.5 h-3.5 text-nexus-blue" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
