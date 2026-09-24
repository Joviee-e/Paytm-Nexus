import React from 'react';
import { Approval } from '../../types/nexus';
import { X, ShieldCheck, CheckCircle2, FileText, Database, Scale } from 'lucide-react';

interface ReasoningModalProps {
  approval: Approval;
  onClose: () => void;
}

export const ReasoningModal: React.FC<ReasoningModalProps> = ({ approval, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-navy/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-nexus-xl border border-nexus-border shadow-nexus-dropdown overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-nexus-border flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-nexus-green flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-nexus-navy">Explainable AI Evidence Chain</h3>
              <p className="text-[11px] text-nexus-muted">Nexus Control Layer Reasoning Audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Recommended Policy / Action
            </span>
            <div className="text-sm font-bold text-nexus-navy mt-0.5">{approval.title}</div>
            <div className="text-slate-500 mt-0.5">By {approval.recommendedBy} • {approval.department}</div>
          </div>

          <div className="p-3 rounded-nexus bg-nexus-bg border border-nexus-border space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-nexus-blue flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              <span>Audited Evidence Basis</span>
            </span>
            <ul className="space-y-1.5 pl-1">
              {approval.evidence.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-nexus-green shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Chronological Audit Trail
            </span>
            <div className="mt-2 space-y-2">
              {approval.auditTrail.map((trail, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-2 rounded-nexus bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-mono text-[10px]">{trail.timestamp}</span>
                    <span className="font-medium text-slate-700">{trail.action}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-nexus-blue">{trail.actor}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-nexus bg-emerald-50/50 border border-emerald-200 text-slate-700 space-y-1">
            <div className="font-semibold text-nexus-navy flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-nexus-green" />
              <span>Merchant Sovereignty Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Nexus will never deploy external communications, alter banking routes, or spend merchant funds without verified manual sign-off in this Control Layer.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-nexus-border flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-nexus bg-nexus-navy text-white text-xs font-semibold hover:bg-nexus-navy/90 transition-colors"
          >
            Close Reasoning
          </button>
        </div>
      </div>
    </div>
  );
};
