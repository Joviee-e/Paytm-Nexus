import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Smartphone,
  Server,
  ArrowRight,
  ShieldCheck,
  Share2,
} from 'lucide-react';

export const FailureInvestigatorDashboard: React.FC = () => {
  const { selectAgent, addToast, navigateTo } = useNexus();
  const [isReviewed, setIsReviewed] = useState(false);

  const rootCauses = [
    {
      title: 'UPI Gateway Degradation',
      likelihood: '98% Confirmed',
      description: 'Partner acquiring switch experiencing intermittent dropouts on NPCI route.',
      icon: Server,
      color: 'border-red-200 bg-red-50/40 text-nexus-red',
    },
    {
      title: 'Timeout Spike (TIMEOUT_U16)',
      likelihood: 'High Impact',
      description: 'Average response latency climbed to 1,420ms triggering merchant client checkout timeouts.',
      icon: Clock,
      color: 'border-amber-200 bg-amber-50/40 text-nexus-amber',
    },
    {
      title: 'Regional Concentration',
      likelihood: 'Identified',
      description: '64% of failed attempts originated from Delhi NCR & Mumbai metro broadband nodes.',
      icon: MapPin,
      color: 'border-blue-200 bg-blue-50/40 text-nexus-blue',
    },
    {
      title: 'Payment Method Anomaly',
      likelihood: 'App Intent Specific',
      description: 'Third-party UPI handles failed handoff protocol; Paytm UPI app succeeded at 99.4%.',
      icon: Smartphone,
      color: 'border-purple-200 bg-purple-50/40 text-nexus-purple',
    },
  ];

  const failureCategories = [
    { category: 'NPCI Bank Switch Timeout (U16)', percentage: 54, count: 1840 },
    { category: 'Customer Pin Abandonment (Z6)', percentage: 22, count: 750 },
    { category: 'Insufficient Funds (U30)', percentage: 14, count: 480 },
    { category: 'Other Protocol Errors', percentage: 10, count: 340 },
  ];

  return (
    <div className="space-y-6">
      {/* Investigation Status Header */}
      <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-nexus-blue">
              Root Cause Diagnostics
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
              Case #INV-8492
            </span>
          </div>
          <h3 className="text-sm font-bold text-nexus-navy mt-1">
            Bank Gateway Switch Degradation Isolated
          </h3>
          <p className="text-xs text-nexus-muted mt-0.5">
            Failure surge between 19:00 - 22:00 was caused by third-party switch timeouts, not merchant frontend bugs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsReviewed(true);
              addToast('Investigation Reviewed', 'Marked Case #INV-8492 as reviewed by Merchant Ops.', 'success');
            }}
            className={`px-3.5 py-1.5 rounded-nexus text-xs font-medium flex items-center gap-1.5 transition-all ${
              isReviewed
                ? 'bg-nexus-green text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 border border-nexus-border text-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isReviewed ? 'Reviewed' : 'Mark Reviewed'}</span>
          </button>
          <button
            onClick={() => {
              selectAgent('incident-coordinator');
              addToast('Incident Escalated', 'Forwarded diagnosis to Incident Coordinator for automated failover.', 'warning');
            }}
            className="px-3.5 py-1.5 rounded-nexus bg-nexus-navy hover:bg-nexus-navy/90 text-white text-xs font-medium flex items-center gap-1.5 shadow-nexus-subtle transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-nexus-amber" />
            <span>Escalate Incident</span>
          </button>
        </div>
      </div>

      {/* Root Cause Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Deconstructed Failure Factors
          </h4>
          <span className="text-xs text-nexus-blue font-medium">Correlation Confidence: 95.8%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rootCauses.map((cause) => {
            const Icon = cause.icon;
            return (
              <div
                key={cause.title}
                className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-subtle hover:border-slate-300 transition-all flex items-start gap-3"
              >
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${cause.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-nexus-navy">{cause.title}</span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {cause.likelihood}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{cause.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Failure Taxonomy Breakdown */}
      <div className="p-5 rounded-nexus-lg bg-white border border-nexus-border shadow-nexus-card">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Return Code Distribution During Peak Anomaly Window
        </h4>

        <div className="space-y-3">
          {failureCategories.map((cat) => (
            <div key={cat.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-nexus-navy">{cat.category}</span>
                <span className="text-slate-500">{cat.percentage}% ({cat.count} events)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-nexus-blue transition-all duration-500"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-nexus-muted">
            Next recommendation: Shift traffic to Secondary Gateway via Payment Sentinel
          </span>
          <button
            onClick={() => selectAgent('payment-sentinel')}
            className="text-xs font-semibold text-nexus-blue hover:underline flex items-center gap-1"
          >
            <span>Back to Payment Sentinel</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
