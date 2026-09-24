import React, { useState } from 'react';
import { Approval } from '../../types/nexus';
import { useNexus } from '../../context/NexusContext';
import { X, Check, Sliders, Shield } from 'lucide-react';

interface EditApprovalModalProps {
  approval: Approval;
  onClose: () => void;
}

export const EditApprovalModal: React.FC<EditApprovalModalProps> = ({ approval, onClose }) => {
  const { editApproval } = useNexus();

  const [audience, setAudience] = useState(approval.audience);
  const [objective, setObjective] = useState(approval.objective);
  const [budget, setBudget] = useState(approval.budget || '₹25,000');
  const [duration, setDuration] = useState(approval.duration || '7 days');
  const [channel, setChannel] = useState(approval.channel || 'WhatsApp & App Push');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    editApproval(approval.id, {
      audience,
      objective,
      budget,
      duration,
      channel,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nexus-navy/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-nexus-xl border border-nexus-border shadow-nexus-dropdown overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-nexus-border flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-nexus-lightblue text-nexus-blue flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-nexus-navy">Edit Approval Parameters</h3>
              <p className="text-[11px] text-nexus-muted">Human-in-the-loop parameter fine-tuning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-nexus-navy mb-1">Target Audience</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-3 py-2 rounded-nexus border border-nexus-border focus:border-nexus-blue focus:ring-1 focus:ring-nexus-blue focus:outline-none text-slate-700 text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-nexus-navy mb-1">Campaign Objective</label>
            <textarea
              rows={2}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-3 py-2 rounded-nexus border border-nexus-border focus:border-nexus-blue focus:ring-1 focus:ring-nexus-blue focus:outline-none text-slate-700 text-xs leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-nexus-navy mb-1">Authorized Budget</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-nexus border border-nexus-border focus:border-nexus-blue focus:ring-1 focus:ring-nexus-blue focus:outline-none text-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-nexus-navy mb-1">Campaign Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-nexus border border-nexus-border focus:border-nexus-blue focus:ring-1 focus:ring-nexus-blue focus:outline-none text-slate-700 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-nexus-navy mb-1">Delivery Channels</label>
            <input
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full px-3 py-2 rounded-nexus border border-nexus-border focus:border-nexus-blue focus:ring-1 focus:ring-nexus-blue focus:outline-none text-slate-700 text-xs"
            />
          </div>

          <div className="p-3 rounded-nexus bg-blue-50/50 border border-nexus-blue/20 text-[11px] text-slate-600 flex items-start gap-2">
            <Shield className="w-3.5 h-3.5 text-nexus-blue shrink-0 mt-0.5" />
            <span>
              All modifications are permanently recorded in the immutable Nexus Control Layer audit trail.
            </span>
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-nexus-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-nexus bg-white hover:bg-slate-50 border border-nexus-border text-slate-600 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-nexus bg-nexus-blue hover:bg-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Update Card</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
