import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Filter,
  DollarSign,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';

export const SettlementDashboard: React.FC = () => {
  const { navigateTo, addToast } = useNexus();
  const [resolvedMap, setResolvedMap] = useState<Record<string, boolean>>({});

  const toggleResolved = (id: string, name: string) => {
    setResolvedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    const nowResolved = !resolvedMap[id];
    addToast(
      nowResolved ? 'Discrepancy Resolved' : 'Marked Pending',
      `Record ${name} marked as ${nowResolved ? 'resolved' : 'pending verification'}.`,
      nowResolved ? 'success' : 'info'
    );
  };

  const exceptions = [
    {
      id: 'exc-1',
      orderId: 'PTM-98214',
      utr: 'UTR849204921',
      expected: '₹15,000',
      settled: '₹14,850',
      diff: '₹150',
      reason: '0.01% GST fractional roundoff in bank nodal interchange ledger',
      status: 'Actionable Mismatch',
      agentNote: 'Auto-waiver queued for merchant authorization',
    },
    {
      id: 'exc-2',
      orderId: 'PTM-98205',
      utr: 'UTR849204899',
      expected: '₹4,500',
      settled: '₹4,500',
      diff: '₹0',
      reason: 'Batch transit timing difference; cleared in evening cycle',
      status: 'Auto-Matched',
      agentNote: 'Cleared automatically by Settlement Investigator',
    },
    {
      id: 'exc-3',
      orderId: 'PTM-98198',
      utr: 'UTR849204850',
      expected: '₹2,350',
      settled: '₹2,350',
      diff: '₹0',
      reason: 'Interchange fee verified against standard merchant slab',
      status: 'Auto-Matched',
      agentNote: 'Cleared automatically by Settlement Investigator',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
          <div className="text-xs text-nexus-muted font-medium">Matched Transactions</div>
          <div className="text-xl font-bold text-nexus-navy mt-1">14,280</div>
          <div className="text-[11px] text-nexus-green font-semibold mt-0.5">99.4% Matched</div>
        </div>

        <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
          <div className="text-xs text-nexus-muted font-medium">Recon Exceptions</div>
          <div className="text-xl font-bold text-nexus-navy mt-1">32</div>
          <div className="text-[11px] text-nexus-amber font-semibold mt-0.5">31 Cleared, 1 Actionable</div>
        </div>

        <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
          <div className="text-xs text-nexus-muted font-medium">Pending Settlements</div>
          <div className="text-xl font-bold text-nexus-navy mt-1">₹14.8L</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Disbursing Today at 17:00</div>
        </div>

        <div className="p-4 rounded-nexus bg-white border border-nexus-border shadow-nexus-card">
          <div className="text-xs text-nexus-muted font-medium">Total Variance Gap</div>
          <div className="text-xl font-bold text-nexus-red mt-1">₹150</div>
          <div className="text-[11px] text-nexus-blue font-semibold mt-0.5 hover:underline cursor-pointer" onClick={() => navigateTo('approvals')}>
            Waiver Ready →
          </div>
        </div>
      </div>

      {/* Discrepancy Mismatch Table */}
      <div className="p-5 rounded-nexus-lg bg-white border border-nexus-border shadow-nexus-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-nexus-navy">Reconciliation Exception Audit</h3>
            <p className="text-xs text-nexus-muted mt-0.5">
              Live automated matching against bank MIS feeds and merchant order ledger
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('approvals')}
              className="px-3 py-1.5 rounded-nexus bg-nexus-navy text-white text-xs font-medium flex items-center gap-1.5 shadow-nexus-subtle hover:bg-nexus-navy/90 transition-all"
            >
              <FileCheck className="w-3.5 h-3.5 text-nexus-blue" />
              <span>Review ₹150 Waiver in Approvals</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-nexus-border text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-2.5">Order ID / UTR</th>
                <th className="pb-2.5">Expected Gross</th>
                <th className="pb-2.5">Settled Bank Amt</th>
                <th className="pb-2.5">Discrepancy</th>
                <th className="pb-2.5">Diagnostic Finding</th>
                <th className="pb-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exceptions.map((exc) => {
                const isResolved = resolvedMap[exc.id];
                return (
                  <tr key={exc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3">
                      <div className="font-semibold text-nexus-navy">{exc.orderId}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{exc.utr}</div>
                    </td>
                    <td className="py-3 font-medium text-slate-700">{exc.expected}</td>
                    <td className="py-3 font-medium text-slate-700">{exc.settled}</td>
                    <td className="py-3">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                          exc.diff === '₹0'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-red-50 text-nexus-red border border-red-200'
                        }`}
                      >
                        {exc.diff}
                      </span>
                    </td>
                    <td className="py-3 max-w-xs">
                      <div className="text-slate-700 font-medium">{exc.reason}</div>
                      <div className="text-[10px] text-nexus-blue mt-0.5">{exc.agentNote}</div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            addToast(
                              'Discrepancy Details',
                              `Audited Order #${exc.orderId}: Rounding gap occurs on interchange tax fee ledger.`,
                              'info'
                            )
                          }
                          className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-nexus-navy hover:bg-slate-100 rounded"
                        >
                          View Mismatch
                        </button>
                        <button
                          onClick={() => toggleResolved(exc.id, exc.orderId)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-all ${
                            isResolved
                              ? 'bg-nexus-green text-white'
                              : 'bg-nexus-lightblue text-nexus-blue hover:bg-blue-100'
                          }`}
                        >
                          {isResolved ? 'Resolved ✓' : 'Mark Resolved'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
