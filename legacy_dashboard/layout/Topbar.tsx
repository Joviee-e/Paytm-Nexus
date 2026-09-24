import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  Search,
  Bell,
  ChevronRight,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const {
    currentView,
    activeDepartment,
    activeAgent,
    navigateTo,
    selectDepartment,
    setSearchOpen,
    liveInsights,
  } = useNexus();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMerchantMenu, setShowMerchantMenu] = useState(false);

  // Dynamic breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs = [{ label: 'Nexus', onClick: () => navigateTo('overview') }];

    if (currentView === 'overview') {
      crumbs.push({ label: 'Overview', onClick: () => navigateTo('overview') });
    } else if (currentView === 'graph') {
      crumbs.push({ label: 'Intelligence Graph', onClick: () => navigateTo('graph') });
    } else if (currentView === 'departments') {
      crumbs.push({ label: 'Departments', onClick: () => navigateTo('departments') });
    } else if (currentView === 'department' && activeDepartment) {
      crumbs.push({ label: 'Departments', onClick: () => navigateTo('departments') });
      crumbs.push({
        label: activeDepartment.name,
        onClick: () => selectDepartment(activeDepartment.id),
      });
    } else if (currentView === 'agent' && activeAgent) {
      crumbs.push({ label: 'Departments', onClick: () => navigateTo('departments') });
      if (activeDepartment) {
        crumbs.push({
          label: activeDepartment.name,
          onClick: () => selectDepartment(activeDepartment.id),
        });
      }
      crumbs.push({
        label: activeAgent.name,
        onClick: () => {},
      });
    } else if (currentView === 'activity') {
      crumbs.push({ label: 'Activity', onClick: () => navigateTo('activity') });
    } else if (currentView === 'approvals') {
      crumbs.push({ label: 'Approvals', onClick: () => navigateTo('approvals') });
    } else if (currentView === 'reports') {
      crumbs.push({ label: 'Reports', onClick: () => navigateTo('reports') });
    } else if (currentView === 'settings') {
      crumbs.push({ label: 'Settings', onClick: () => navigateTo('settings') });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-nexus-border px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Dynamic Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
            <button
              onClick={crumb.onClick}
              className={`hover:text-nexus-navy transition-colors font-medium ${
                idx === breadcrumbs.length - 1
                  ? 'text-nexus-navy font-semibold pointer-events-none'
                  : 'text-slate-500'
              }`}
            >
              {crumb.label}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Center: Command / Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-nexus bg-nexus-bg border border-nexus-border hover:border-nexus-blue/40 hover:bg-white text-slate-400 text-xs transition-all shadow-nexus-subtle group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-nexus-blue transition-colors" />
            <span className="text-slate-500 group-hover:text-slate-700">Ask Nexus or search anything…</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right: Status & Actions */}
      <div className="flex items-center gap-3">
        {/* Demo Mode Badge with Tooltip */}
        <div className="relative group">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-nexus-lightblue text-nexus-blue border border-nexus-blue/20 text-[11px] font-semibold tracking-wide cursor-help">
            <Zap className="w-3 h-3 text-nexus-blue fill-nexus-blue/20" />
            <span>DEMO MODE</span>
          </div>
          {/* Tooltip */}
          <div className="absolute right-0 top-full mt-2 w-64 p-2.5 bg-nexus-navy text-white text-[11px] rounded-lg shadow-nexus-dropdown opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 leading-relaxed">
            Simulated merchant intelligence environment. All data is locally generated for demonstration.
          </div>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-nexus text-slate-500 hover:text-nexus-navy hover:bg-slate-100 transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-nexus-blue ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-nexus border border-nexus-border shadow-nexus-dropdown p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-nexus-border">
                <span className="text-xs font-bold text-nexus-navy">Live Intelligence Signals</span>
                <span className="text-[10px] text-nexus-muted">{liveInsights.length} updates</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                {liveInsights.map((ins) => (
                  <div
                    key={ins.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigateTo('agent', ins.departmentId, ins.agentId);
                    }}
                    className="py-2.5 px-1.5 hover:bg-nexus-bg rounded cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      {ins.severity === 'warning' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-nexus-amber shrink-0 mt-0.5" />
                      ) : ins.severity === 'success' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-nexus-green shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-nexus-blue shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="text-xs font-medium text-nexus-navy line-clamp-2">
                          {ins.title}
                        </div>
                        <div className="text-[10px] text-nexus-muted mt-0.5">
                          {ins.agentName} • {ins.departmentName}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-nexus-border" />

        {/* Merchant Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMerchantMenu(!showMerchantMenu)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-nexus hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-nexus-navy to-nexus-blue text-white flex items-center justify-center font-bold text-xs shadow-xs">
              DM
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-nexus-navy leading-none">Demo Merchant</div>
              <div className="text-[10px] text-nexus-muted mt-0.5">Enterprise Plan</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showMerchantMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-nexus border border-nexus-border shadow-nexus-dropdown p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-2 py-1.5 text-xs text-slate-500 border-b border-nexus-border">
                Signed in as <span className="font-semibold text-nexus-navy">merchant@paytm.demo</span>
              </div>
              <button
                onClick={() => {
                  setShowMerchantMenu(false);
                  navigateTo('settings');
                }}
                className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-nexus-bg rounded transition-colors mt-1"
              >
                Merchant Settings
              </button>
              <button
                onClick={() => {
                  setShowMerchantMenu(false);
                  navigateTo('approvals');
                }}
                className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-nexus-bg rounded transition-colors"
              >
                Approvals & Governance
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
