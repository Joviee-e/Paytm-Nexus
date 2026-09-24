import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import { Approval } from '../types/nexus';
import { EditApprovalModal } from '../components/modals/EditApprovalModal';
import { ReasoningModal } from '../components/modals/ReasoningModal';
import {
  CheckSquare,
  Check,
  X,
  Sliders,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const Approvals: React.FC = () => {
  const { approvals, approveItem, rejectItem } = useNexus();

  const [editingApproval, setEditingApproval] = useState<Approval | null>(null);
  const [reasoningApproval, setReasoningApproval] = useState<Approval | null>(null);

  const pendingApprovals = approvals.filter((a: Approval) => a.status === 'Awaiting merchant approval');
  const pastApprovals = approvals.filter((a: Approval) => a.status !== 'Awaiting merchant approval');

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-nexus-lightblue text-nexus-blue border border-nexus-blue/20 text-xs font-semibold mb-2">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Human-in-the-Loop Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-nexus-navy tracking-tight">
          Intelligence recommends. You decide.
        </h1>
        <p className="text-sm text-nexus-muted mt-1 font-normal">
          Autonomous intelligence. Merchant-controlled execution.
        </p>
      </div>

      {/* Trust Panel: Nexus Control Layer */}
      <div className="p-5 rounded-nexus-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-nexus-blue/20 shadow-nexus-card">
        <div className="flex items-center justify-between pb-3 border-b border-nexus-blue/15">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-nexus-blue" />
            <span className="text-xs font-bold uppercase tracking-wider text-nexus-navy">
              NEXUS CONTROL LAYER
            </span>
          </div>
          <span className="text-[10px] font-semibold text-nexus-blue bg-white px-2 py-0.5 rounded border border-nexus-blue/20">
            Immutable Audit Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-xs font-semibold text-nexus-navy">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-nexus-green shrink-0" />
            <span>Evidence-backed insights</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-nexus-green shrink-0" />
            <span>Controlled tool access</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-nexus-green shrink-0" />
            <span>Immutable audit trail</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-nexus-green shrink-0" />
            <span>Human checkpoints</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-nexus-green shrink-0" />
            <span>Explainable reasoning</span>
          </div>
        </div>
      </div>

      {/* Pending Approvals List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-nexus-navy">
            Pending Merchant Approvals ({pendingApprovals.length})
          </h2>
          <span className="text-xs text-nexus-muted">
            All actions require explicit merchant signature
          </span>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="p-8 rounded-nexus-xl bg-white border border-nexus-border text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-nexus-green mx-auto mb-2" />
            <p className="text-sm font-semibold text-nexus-navy">All recommendations resolved</p>
            <p className="text-xs text-slate-500 mt-0.5">
              The autonomous workforce is operating smoothly within verified merchant boundaries.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map((approval: Approval) => (
              <div
                key={approval.id}
                className="p-6 rounded-nexus-xl bg-white border border-nexus-border hover:border-nexus-blue/40 shadow-nexus-card space-y-4 transition-all"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-nexus-blue">
                        {approval.department}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">
                        Recommended by <strong className="text-nexus-navy">{approval.recommendedBy}</strong>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">({approval.createdAt})</span>
                    </div>
                    <h3 className="text-base font-bold text-nexus-navy mt-1">{approval.title}</h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-nexus-amber border border-amber-200 shrink-0">
                    Awaiting merchant approval
                  </span>
                </div>

                {/* Parameters Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-nexus bg-nexus-bg border border-nexus-border text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Target Audience / Scope
                    </span>
                    <div className="font-semibold text-nexus-navy mt-0.5">{approval.audience}</div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Strategic Objective
                    </span>
                    <div className="font-medium text-slate-700 mt-0.5">{approval.objective}</div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Expected Outcome & ROI
                    </span>
                    <div className="font-semibold text-nexus-blue mt-0.5">{approval.expectedOutcome}</div>
                  </div>
                </div>

                {/* Secondary details if available */}
                {(approval.budget || approval.duration || approval.channel) && (
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 px-1">
                    {approval.budget && (
                      <div>
                        <span className="text-slate-400">Budget: </span>
                        <strong className="text-nexus-navy">{approval.budget}</strong>
                      </div>
                    )}
                    {approval.duration && (
                      <div>
                        <span className="text-slate-400">Duration: </span>
                        <strong className="text-nexus-navy">{approval.duration}</strong>
                      </div>
                    )}
                    {approval.channel && (
                      <div>
                        <span className="text-slate-400">Channel: </span>
                        <strong className="text-nexus-navy">{approval.channel}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 border-t border-nexus-border flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReasoningApproval(approval)}
                      className="px-3 py-1.5 rounded-nexus bg-white hover:bg-slate-50 border border-nexus-border text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Reasoning</span>
                    </button>
                    <button
                      onClick={() => setEditingApproval(approval)}
                      className="px-3 py-1.5 rounded-nexus bg-white hover:bg-slate-50 border border-nexus-border text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Parameters</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => rejectItem(approval.id)}
                      className="px-3.5 py-1.5 rounded-nexus bg-white hover:bg-red-50 border border-slate-200 text-slate-700 hover:text-nexus-red text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => approveItem(approval.id)}
                      className="px-4 py-1.5 rounded-nexus bg-nexus-blue hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-nexus-subtle hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Authorize</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical / Approved Actions */}
      {pastApprovals.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-nexus-border">
          <h2 className="text-base font-bold text-nexus-navy">
            Resolved Governance Actions ({pastApprovals.length})
          </h2>

          <div className="space-y-2.5">
            {pastApprovals.map((appr: Approval) => (
              <div
                key={appr.id}
                className="p-4 rounded-nexus bg-white border border-nexus-border flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-nexus-navy">{appr.title}</div>
                  <div className="text-[11px] text-nexus-muted">
                    Recommended by {appr.recommendedBy} • {appr.audience}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                      appr.status === 'Approved'
                        ? 'bg-emerald-50 text-nexus-green border border-emerald-200'
                        : 'bg-red-50 text-nexus-red border border-red-200'
                    }`}
                  >
                    {appr.status === 'Approved' ? 'Approved & Queued' : 'Declined'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingApproval && (
        <EditApprovalModal
          approval={editingApproval}
          onClose={() => setEditingApproval(null)}
        />
      )}

      {/* Reasoning Modal */}
      {reasoningApproval && (
        <ReasoningModal
          approval={reasoningApproval}
          onClose={() => setReasoningApproval(null)}
        />
      )}
    </div>
  );
};
