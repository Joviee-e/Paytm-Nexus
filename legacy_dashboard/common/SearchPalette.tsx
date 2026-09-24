import React, { useState, useEffect, useRef } from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  Search,
  X,
  CreditCard,
  Scale,
  TrendingUp,
  Users,
  Layers,
  Sparkles,
  CheckSquare,
  ArrowRight,
  Shield,
  Activity,
} from 'lucide-react';

export const SearchPalette: React.FC = () => {
  const {
    isSearchOpen,
    setSearchOpen,
    departments,
    agents,
    approvals,
    navigateTo,
    selectDepartment,
    selectAgent,
    startInvestigation,
  } = useNexus();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.toLowerCase().trim();

  // Search filter
  const filteredDepts = departments.filter(
    (d) => d.name.toLowerCase().includes(trimmed) || d.descriptor.toLowerCase().includes(trimmed)
  );

  const filteredAgents = Object.values(agents).filter(
    (a) =>
      a.name.toLowerCase().includes(trimmed) ||
      a.departmentName.toLowerCase().includes(trimmed) ||
      a.subtitle.toLowerCase().includes(trimmed) ||
      a.capabilities.some((c) => c.toLowerCase().includes(trimmed))
  );

  const filteredApprovals = approvals.filter(
    (appr) =>
      appr.title.toLowerCase().includes(trimmed) ||
      appr.recommendedBy.toLowerCase().includes(trimmed) ||
      appr.objective.toLowerCase().includes(trimmed)
  );

  const isDemoMatch =
    'investigate revenue drop cross department collaboration demo scenario'
      .toLowerCase()
      .includes(trimmed);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-nexus-navy/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-nexus-lg border border-nexus-border shadow-nexus-dropdown overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-nexus-border gap-3">
          <Search className="w-5 h-5 text-nexus-blue shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Nexus or search anything (e.g. Payment Sentinel, revenue, approvals)..."
            className="w-full bg-transparent text-sm text-nexus-navy placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="px-1.5 py-0.5 text-[10px] uppercase font-semibold bg-slate-100 hover:bg-slate-200 text-slate-500 rounded transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs">
          {/* Showcase Multi-Agent Demo Flow suggestion */}
          {isDemoMatch && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-semibold text-nexus-blue uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Featured Multi-Agent Investigation</span>
              </div>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  startInvestigation();
                }}
                className="w-full flex items-center justify-between p-3 rounded-nexus bg-gradient-to-r from-nexus-lightblue to-blue-50/50 border border-nexus-blue/20 hover:border-nexus-blue/50 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-nexus-blue text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-nexus-navy text-sm">
                      Investigate Revenue Drop
                    </div>
                    <div className="text-[11px] text-nexus-muted">
                      Run coordinated 6-agent workforce across Payments, Finance & Growth
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-nexus-blue group-hover:translate-x-0.5 transition-transform">
                  <span>Start Flow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          )}

          {/* Departments */}
          {filteredDepts.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Departments ({filteredDepts.length})
              </div>
              <div className="grid grid-cols-1 gap-1">
                {filteredDepts.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setSearchOpen(false);
                      selectDepartment(dept.id);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-nexus hover:bg-slate-50 border border-transparent hover:border-nexus-border text-left transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-nexus-lightblue/70 text-nexus-blue flex items-center justify-center">
                        {dept.id === 'payment-ops' && <CreditCard className="w-3.5 h-3.5" />}
                        {dept.id === 'finance-recon' && <Scale className="w-3.5 h-3.5" />}
                        {dept.id === 'merchant-growth' && <TrendingUp className="w-3.5 h-3.5" />}
                        {dept.id === 'customer-intel' && <Users className="w-3.5 h-3.5" />}
                        {dept.id === 'biz-ops' && <Layers className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="font-semibold text-nexus-navy">{dept.name}</div>
                        <div className="text-[11px] text-nexus-muted">{dept.descriptor}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{dept.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Agents */}
          {filteredAgents.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Workforce Agents ({filteredAgents.length})
              </div>
              <div className="grid grid-cols-1 gap-1">
                {filteredAgents.slice(0, 8).map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSearchOpen(false);
                      selectAgent(agent.id);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-nexus hover:bg-slate-50 border border-transparent hover:border-nexus-border text-left transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-white border border-nexus-border text-nexus-navy flex items-center justify-center shadow-xs">
                        <Activity className="w-3.5 h-3.5 text-nexus-blue" />
                      </div>
                      <div>
                        <div className="font-semibold text-nexus-navy">{agent.name}</div>
                        <div className="text-[11px] text-nexus-muted">{agent.departmentName} • {agent.subtitle}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-nexus-lightblue text-nexus-blue">
                      {agent.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Approvals */}
          {filteredApprovals.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Approvals & Governance ({filteredApprovals.length})
              </div>
              <div className="grid grid-cols-1 gap-1">
                {filteredApprovals.map((appr) => (
                  <button
                    key={appr.id}
                    onClick={() => {
                      setSearchOpen(false);
                      navigateTo('approvals');
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-nexus hover:bg-slate-50 border border-transparent hover:border-nexus-border text-left transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-amber-50 text-nexus-amber flex items-center justify-center">
                        <CheckSquare className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-nexus-navy">{appr.title}</div>
                        <div className="text-[11px] text-nexus-muted">By {appr.recommendedBy} • {appr.status}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">View in Approvals</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredDepts.length === 0 &&
            filteredAgents.length === 0 &&
            filteredApprovals.length === 0 &&
            !isDemoMatch && (
              <div className="p-8 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-600">No matching items found</p>
                <p className="text-xs mt-1 text-slate-400">Try searching for &quot;Payment&quot;, &quot;Revenue&quot;, &quot;Reconciliation&quot;, or &quot;VIP&quot;</p>
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 border-t border-nexus-border flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1 bg-white border border-slate-200 rounded text-[10px]">Enter</kbd> to select
            <kbd className="px-1 bg-white border border-slate-200 rounded text-[10px]">Esc</kbd> to close
          </div>
          <div className="flex items-center gap-1 font-medium text-nexus-navy">
            <Shield className="w-3 h-3 text-nexus-blue" />
            <span>Nexus Operating Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
};
