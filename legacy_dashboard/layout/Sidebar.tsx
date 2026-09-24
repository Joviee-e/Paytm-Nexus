import React from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  LayoutDashboard,
  Network,
  Boxes,
  Activity as ActivityIcon,
  CheckSquare,
  FileBarChart,
  Settings as SettingsIcon,
  Sparkles,
  Store,
  Check,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, navigateTo, approvals } = useNexus();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Awaiting merchant approval').length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'graph', label: 'Intelligence Graph', icon: Network },
    { id: 'departments', label: 'Departments', icon: Boxes },
    { id: 'activity', label: 'Activity', icon: ActivityIcon },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-white border-r border-nexus-border flex flex-col h-screen shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-nexus-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-nexus-blue flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-tight">
            P
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-nexus-navy">Paytm</span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-nexus-lightblue text-nexus-blue border border-nexus-blue/20">
                NEXUS
              </span>
            </div>
            <span className="text-[11px] text-nexus-muted tracking-tight">Operating Intelligence Layer</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentView === item.id ||
            (item.id === 'departments' && (currentView === 'department' || currentView === 'agent')) ||
            (item.id === 'overview' && currentView === 'overview');

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-nexus text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-nexus-lightblue text-nexus-navy font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-nexus-navy hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-nexus-blue' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-nexus-blue text-white shadow-xs">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Showcase CTA in sidebar */}
        <div className="pt-4 px-1">
          <div className="p-3 rounded-nexus bg-gradient-to-br from-nexus-lightblue/70 to-blue-50/40 border border-nexus-blue/15">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-nexus-blue mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autonomous Workforce</span>
            </div>
            <p className="text-[11px] text-nexus-muted leading-tight mb-2.5">
              20 specialized agents continuously coordinating across 5 departments.
            </p>
            <div className="flex items-center gap-1 text-[11px] font-medium text-nexus-navy">
              <Check className="w-3 h-3 text-nexus-green" />
              <span>Full merchant control active</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer / System status & Merchant Profile */}
      <div className="p-3 border-t border-nexus-border/60 bg-slate-50/50 space-y-3">
        {/* System status */}
        <div className="flex items-center gap-2 px-2 py-1 text-xs text-nexus-muted">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-nexus-green"></span>
          </span>
          <span className="text-[11px] font-medium text-slate-600">All systems operational</span>
        </div>

        {/* Merchant profile card */}
        <div className="flex items-center gap-3 p-2 rounded-nexus bg-white border border-nexus-border shadow-nexus-subtle">
          <div className="w-9 h-9 rounded-lg bg-nexus-navy/5 border border-nexus-border flex items-center justify-center text-nexus-navy">
            <Store className="w-4 h-4 text-nexus-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-nexus-navy truncate">Demo Merchant</div>
            <div className="text-[11px] text-nexus-muted truncate">Retail & D2C Brand</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-nexus-green shrink-0" title="Online" />
        </div>
      </div>
    </aside>
  );
};
