import React, { useState } from 'react';
import { useNexus } from '../context/NexusContext';
import { Activity as ActivityType } from '../types/nexus';
import {
  Activity as ActivityIcon,
  ArrowRight,
  Search,
} from 'lucide-react';

export const Activity: React.FC = () => {
  const { activities, selectAgent, addToast } = useNexus();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filters = [
    'All',
    'Payments',
    'Finance',
    'Growth',
    'Customers',
    'Operations',
    'Approvals',
  ];

  const filteredActivities = activities.filter((act: ActivityType) => {
    // Category match
    let matchesCategory = true;
    if (activeFilter === 'Payments') matchesCategory = act.departmentId === 'payment-ops';
    else if (activeFilter === 'Finance') matchesCategory = act.departmentId === 'finance-recon';
    else if (activeFilter === 'Growth') matchesCategory = act.departmentId === 'merchant-growth';
    else if (activeFilter === 'Customers') matchesCategory = act.departmentId === 'customer-intel';
    else if (activeFilter === 'Operations') matchesCategory = act.departmentId === 'biz-ops';
    else if (activeFilter === 'Approvals') matchesCategory = act.status === 'Approved' || act.status === 'Action Required';

    // Search query match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      act.event.toLowerCase().includes(q) ||
      act.agent.toLowerCase().includes(q) ||
      act.department.toLowerCase().includes(q) ||
      (act.details && act.details.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-nexus-lightblue text-nexus-blue border border-nexus-blue/20 text-xs font-semibold mb-2">
          <ActivityIcon className="w-3.5 h-3.5" />
          <span>Workforce Audit Stream</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-nexus-navy tracking-tight">
          Everything Nexus is doing.
        </h1>
        <p className="text-sm text-nexus-muted mt-1 font-normal">
          Real-time chronological timeline of 20 coordinated agents operating across all store systems.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-nexus text-xs font-semibold transition-all whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-nexus-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-nexus-navy hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Local search field */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter events..."
            className="w-full pl-8 pr-3 py-1.5 bg-nexus-bg rounded-nexus border border-nexus-border text-xs focus:outline-none focus:border-nexus-blue focus:bg-white text-nexus-navy placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="p-6 rounded-nexus-xl bg-white border border-nexus-border shadow-nexus-card space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <ActivityIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">No activity events match your filter</p>
            <p className="text-xs text-slate-400 mt-0.5">Try resetting the filter or search query</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {filteredActivities.map((act: ActivityType) => {
              let dotColor = 'bg-nexus-blue';
              let badgeStyle = 'bg-blue-50 text-nexus-blue border-blue-200';

              if (act.status === 'Warning') {
                dotColor = 'bg-nexus-amber';
                badgeStyle = 'bg-amber-50 text-nexus-amber border-amber-200';
              } else if (act.status === 'Success' || act.status === 'Approved') {
                dotColor = 'bg-nexus-green';
                badgeStyle = 'bg-emerald-50 text-nexus-green border-emerald-200';
              } else if (act.status === 'Action Required') {
                dotColor = 'bg-nexus-purple';
                badgeStyle = 'bg-purple-50 text-nexus-purple border-purple-200';
              }

              return (
                <div key={act.id} className="relative group">
                  {/* Timeline indicator node */}
                  <div
                    className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ring-slate-100 ${dotColor} transition-transform group-hover:scale-125`}
                  />

                  <div className="p-4 rounded-nexus bg-nexus-bg/50 border border-nexus-border/70 hover:border-nexus-blue/30 hover:bg-white transition-all space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-nexus-navy">{act.agent}</span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[11px] font-medium text-slate-500">{act.department}</span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="font-mono text-[10px] text-slate-400">{act.timestamp}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeStyle} w-fit`}>
                        {act.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {act.event}
                    </p>

                    {act.details && (
                      <p className="text-[11px] text-slate-500 bg-white p-2 rounded-nexus border border-slate-100 leading-relaxed">
                        {act.details}
                      </p>
                    )}

                    <div className="pt-1 flex items-center justify-between text-xs">
                      <button
                        onClick={() => selectAgent(act.agentId)}
                        className="text-xs font-semibold text-nexus-blue hover:underline flex items-center gap-1"
                      >
                        <span>Open {act.agent}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => {
                          addToast('Event Verified', `Logged telemetry entry #${act.id} verified with hash audit.`, 'info');
                        }}
                        className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        View Verification Hash
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
