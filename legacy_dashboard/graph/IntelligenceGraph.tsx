import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { DepartmentId } from '../../types/nexus';
import {
  CreditCard,
  Scale,
  TrendingUp,
  Users,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Search,
  Activity as ActivityIcon,
  BellRing,
  Receipt,
  RotateCcw,
  DollarSign,
  CheckCircle2,
  Compass,
  BarChart3,
  UserMinus,
  MessageSquareHeart,
  HeartHandshake,
  Gauge,
  Cpu,
  ShieldCheck,
  GitMerge,
  Maximize2,
  RotateCcw as ResetIcon,
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export const IntelligenceGraph: React.FC = () => {
  const {
    departments,
    agents,
    activeDepartmentId,
    selectDepartment,
    selectAgent,
    startInvestigation,
  } = useNexus();

  const [hoveredDept, setHoveredDept] = useState<DepartmentId | null>(null);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  // SVG coordinate canvas 900 x 540
  const width = 900;
  const height = 540;
  const center: Point = { x: 450, y: 250 };

  // Base coordinates for the 5 departments in an ergonomic layout
  const defaultDeptPositions: Record<DepartmentId, Point> = {
    'payment-ops': { x: 190, y: 115 },
    'finance-recon': { x: 710, y: 115 },
    'merchant-growth': { x: 730, y: 380 },
    'customer-intel': { x: 450, y: 445 },
    'biz-ops': { x: 170, y: 380 },
  };

  // If a department is selected, calculate focused positions
  const getDeptPos = (deptId: DepartmentId): Point => {
    if (!activeDepartmentId) {
      return defaultDeptPositions[deptId];
    }
    if (activeDepartmentId === deptId) {
      // Shift upward slightly for expansion space
      return { x: defaultDeptPositions[deptId].x, y: defaultDeptPositions[deptId].y - 30 };
    }
    return defaultDeptPositions[deptId];
  };

  // Agent satellite positions around their parent department
  const getAgentPositions = (deptId: DepartmentId): { id: string; pos: Point }[] => {
    const dept = departments.find((d) => d.id === deptId);
    if (!dept) return [];

    const parentPos = getDeptPos(deptId);
    const radius = 120;

    // Arrange 4 agents in an arc or orbital cluster around parent
    const offsets: Record<DepartmentId, Point[]> = {
      'payment-ops': [
        { x: -90, y: 70 },
        { x: 30, y: 100 },
        { x: 150, y: 70 },
        { x: 120, y: -50 },
      ],
      'finance-recon': [
        { x: -130, y: 70 },
        { x: -30, y: 100 },
        { x: 90, y: 70 },
        { x: -110, y: -50 },
      ],
      'merchant-growth': [
        { x: -130, y: -70 },
        { x: -40, y: -100 },
        { x: 90, y: -60 },
        { x: -110, y: 40 },
      ],
      'customer-intel': [
        { x: -180, y: -30 },
        { x: -70, y: -75 },
        { x: 70, y: -75 },
        { x: 180, y: -30 },
      ],
      'biz-ops': [
        { x: -80, y: -60 },
        { x: 50, y: -100 },
        { x: 140, y: -70 },
        { x: 110, y: 40 },
      ],
    };

    const specificOffsets = offsets[deptId] || [
      { x: -80, y: 80 },
      { x: 0, y: 100 },
      { x: 80, y: 80 },
      { x: 0, y: -70 },
    ];

    return dept.agentIds.map((agentId, index) => ({
      id: agentId,
      pos: {
        x: Math.max(50, Math.min(width - 70, parentPos.x + specificOffsets[index].x)),
        y: Math.max(40, Math.min(height - 40, parentPos.y + specificOffsets[index].y)),
      },
    }));
  };

  const getDeptIcon = (id: DepartmentId) => {
    switch (id) {
      case 'payment-ops':
        return <CreditCard className="w-5 h-5 text-nexus-blue" />;
      case 'finance-recon':
        return <Scale className="w-5 h-5 text-nexus-navy" />;
      case 'merchant-growth':
        return <TrendingUp className="w-5 h-5 text-nexus-green" />;
      case 'customer-intel':
        return <Users className="w-5 h-5 text-nexus-purple" />;
      case 'biz-ops':
        return <Layers className="w-5 h-5 text-slate-700" />;
    }
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'payment-sentinel':
        return <ShieldAlert className="w-3.5 h-3.5 text-nexus-blue" />;
      case 'failure-investigator':
        return <Search className="w-3.5 h-3.5 text-nexus-amber" />;
      case 'payment-health-analyst':
        return <ActivityIcon className="w-3.5 h-3.5 text-nexus-green" />;
      case 'incident-coordinator':
        return <BellRing className="w-3.5 h-3.5 text-nexus-purple" />;
      case 'settlement-investigator':
        return <Receipt className="w-3.5 h-3.5 text-nexus-navy" />;
      case 'refund-tracker':
        return <RotateCcw className="w-3.5 h-3.5 text-nexus-blue" />;
      case 'financial-analyst':
        return <DollarSign className="w-3.5 h-3.5 text-nexus-green" />;
      case 'reconciliation-coordinator':
        return <CheckCircle2 className="w-3.5 h-3.5 text-nexus-purple" />;
      case 'revenue-forecaster':
        return <TrendingUp className="w-3.5 h-3.5 text-nexus-green" />;
      case 'opportunity-scout':
        return <Compass className="w-3.5 h-3.5 text-nexus-blue" />;
      case 'business-analyst':
        return <BarChart3 className="w-3.5 h-3.5 text-nexus-navy" />;
      case 'campaign-strategist':
        return <Sparkles className="w-3.5 h-3.5 text-nexus-purple" />;
      case 'customer-segmenter':
        return <Users className="w-3.5 h-3.5 text-nexus-purple" />;
      case 'churn-predictor':
        return <UserMinus className="w-3.5 h-3.5 text-nexus-red" />;
      case 'customer-support-agent':
        return <MessageSquareHeart className="w-3.5 h-3.5 text-nexus-blue" />;
      case 'retention-coordinator':
        return <HeartHandshake className="w-3.5 h-3.5 text-nexus-green" />;
      case 'operations-analyst':
        return <Gauge className="w-3.5 h-3.5 text-slate-700" />;
      case 'process-optimizer':
        return <Cpu className="w-3.5 h-3.5 text-nexus-blue" />;
      case 'compliance-monitor':
        return <ShieldCheck className="w-3.5 h-3.5 text-nexus-green" />;
      case 'decision-support-agent':
        return <GitMerge className="w-3.5 h-3.5 text-nexus-navy" />;
      default:
        return <ActivityIcon className="w-3.5 h-3.5 text-nexus-blue" />;
    }
  };

  // Smooth curved bezier generator between two points
  const getCurvedPath = (start: Point, end: Point) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const cx1 = start.x + dx * 0.45;
    const cy1 = start.y + dy * 0.1;
    const cx2 = start.x + dx * 0.55;
    const cy2 = start.y + dy * 0.9;
    return `M ${start.x} ${start.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${end.x} ${end.y}`;
  };

  return (
    <div className="relative w-full bg-white rounded-nexus-xl border border-nexus-border shadow-nexus-card overflow-hidden select-none">
      {/* Graph Toolbar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full border border-nexus-border text-[11px] font-medium text-nexus-navy shadow-nexus-subtle flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-nexus-blue animate-ping" />
            <span>Interactive Intelligence Graph</span>
          </div>
          {activeDepartmentId && (
            <button
              onClick={() => selectDepartment(null)}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 rounded-full border border-nexus-border text-[11px] font-medium text-slate-600 shadow-nexus-subtle flex items-center gap-1 transition-colors"
            >
              <ResetIcon className="w-3 h-3 text-slate-400" />
              <span>Reset Graph View</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={startInvestigation}
            className="px-3 py-1.5 rounded-full bg-nexus-navy hover:bg-nexus-navy/90 text-white text-xs font-medium shadow-nexus-subtle flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-nexus-blue" />
            <span>Investigate revenue drop</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full h-[540px] flex items-center justify-center overflow-hidden">
        {/* SVG Connectors Background */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            {/* Subtle radial gradient background aura */}
            <radialGradient id="nexusAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0066FF" stopOpacity="0.08" />
              <stop offset="70%" stopColor="#EAF3FF" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
            {/* Gradient for active flow lines */}
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0066FF" />
              <stop offset="100%" stopColor="#7C5CFC" />
            </linearGradient>
          </defs>

          {/* Central background aura */}
          <circle cx={center.x} cy={center.y} r="180" fill="url(#nexusAura)" />

          {/* Department to Center Connectors */}
          {departments.map((dept) => {
            const deptPos = getDeptPos(dept.id);
            const isSelected = activeDepartmentId === dept.id;
            const isHovered = hoveredDept === dept.id;
            const isMuted = activeDepartmentId && activeDepartmentId !== dept.id;

            return (
              <g key={`conn-${dept.id}`} className="transition-all duration-500">
                {/* Background base path */}
                <path
                  d={getCurvedPath(center, deptPos)}
                  fill="none"
                  stroke={isSelected || isHovered ? '#0066FF' : '#E3EAF3'}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.5}
                  strokeOpacity={isMuted ? 0.3 : 1}
                  className="transition-all duration-300"
                />

                {/* Animated active telemetry pulse if selected or hovered */}
                {(isSelected || isHovered) && (
                  <path
                    d={getCurvedPath(center, deptPos)}
                    fill="none"
                    stroke="url(#flowGrad)"
                    strokeWidth="2.5"
                    className="animate-flow-dash"
                  />
                )}
              </g>
            );
          })}

          {/* Agent to Department Connectors (rendered if department is active) */}
          {activeDepartmentId &&
            getAgentPositions(activeDepartmentId).map((agentObj) => {
              const deptPos = getDeptPos(activeDepartmentId);
              const isAgentHovered = hoveredAgent === agentObj.id;

              return (
                <g key={`conn-agent-${agentObj.id}`} className="transition-all duration-300 animate-in fade-in">
                  <path
                    d={getCurvedPath(deptPos, agentObj.pos)}
                    fill="none"
                    stroke={isAgentHovered ? '#0066FF' : '#CBD5E1'}
                    strokeWidth={isAgentHovered ? 2 : 1.25}
                    strokeDasharray="4 4"
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
        </svg>

        {/* ============================================================ */}
        {/* CENTER NODE: PAYTM NEXUS                                     */}
        {/* ============================================================ */}
        <div
          style={{
            left: `${center.x}px`,
            top: `${center.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute z-10 flex flex-col items-center justify-center cursor-pointer group"
          onClick={() => selectDepartment(null)}
        >
          {/* Subtle outer pulsing aura ring */}
          <div className="absolute w-44 h-44 rounded-full bg-nexus-blue/10 animate-soft-pulse pointer-events-none" />
          <div className="absolute w-36 h-36 rounded-full bg-nexus-lightblue/80 border border-nexus-blue/20 pointer-events-none" />

          {/* Central dominant node card */}
          <div className="relative w-32 h-32 rounded-full bg-white border-2 border-nexus-blue/40 shadow-nexus-dropdown flex flex-col items-center justify-center p-3 text-center transition-all duration-300 group-hover:border-nexus-blue group-hover:scale-105">
            <div className="w-8 h-8 rounded-lg bg-nexus-blue text-white flex items-center justify-center font-bold text-sm shadow-sm mb-1">
              P
            </div>
            <span className="text-xs font-extrabold tracking-tight text-nexus-navy">
              PAYTM NEXUS
            </span>
            <span className="text-[9px] font-medium text-nexus-blue leading-tight mt-0.5">
              Intelligence That Connects
            </span>
            <div className="mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-nexus-green animate-pulse" />
              <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider">
                20 Agents
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5 DEPARTMENT NODES                                           */}
        {/* ============================================================ */}
        {departments.map((dept) => {
          const pos = getDeptPos(dept.id);
          const isSelected = activeDepartmentId === dept.id;
          const isMuted = activeDepartmentId && activeDepartmentId !== dept.id;
          const isHovered = hoveredDept === dept.id;

          return (
            <div
              key={dept.id}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute z-10 transition-all duration-500 cursor-pointer ${
                isMuted ? 'opacity-35 grayscale-[50%] scale-95' : 'opacity-100'
              }`}
              onMouseEnter={() => setHoveredDept(dept.id)}
              onMouseLeave={() => setHoveredDept(null)}
              onClick={() => selectDepartment(isSelected ? null : dept.id)}
            >
              <div
                className={`w-48 bg-white rounded-nexus p-3 border transition-all duration-300 ${
                  isSelected
                    ? 'border-nexus-blue ring-2 ring-nexus-blue/20 shadow-nexus-dropdown scale-105'
                    : isHovered
                    ? 'border-nexus-blue/60 shadow-nexus-hover -translate-y-1'
                    : 'border-nexus-border shadow-nexus-subtle'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg bg-nexus-bg border border-nexus-border flex items-center justify-center shrink-0">
                    {getDeptIcon(dept.id)}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-nexus-green" />
                    <span className="text-[9px] font-medium text-slate-400">Active</span>
                  </div>
                </div>

                <div className="mt-2 font-semibold text-xs text-nexus-navy leading-tight">
                  {dept.name}
                </div>
                <div className="text-[10px] text-nexus-muted leading-tight mt-0.5 line-clamp-1">
                  {dept.descriptor}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-nexus-blue font-semibold">4 Specialized Agents</span>
                  <ArrowRight
                    className={`w-3 h-3 text-nexus-blue transition-transform ${
                      isSelected ? 'rotate-90' : isHovered ? 'translate-x-0.5' : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* ============================================================ */}
        {/* SATELLITE AGENT NODES (Shown when a department is active)   */}
        {/* ============================================================ */}
        {activeDepartmentId &&
          getAgentPositions(activeDepartmentId).map((agentObj) => {
            const agent = agents[agentObj.id];
            if (!agent) return null;

            const isAgentHovered = hoveredAgent === agent.id;

            return (
              <div
                key={agent.id}
                style={{
                  left: `${agentObj.pos.x}px`,
                  top: `${agentObj.pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-20 cursor-pointer animate-in fade-in zoom-in-90 duration-300"
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
                onClick={() => selectAgent(agent.id)}
              >
                {/* Agent Node: smaller outlined white card */}
                <div
                  className={`w-40 bg-white rounded-nexus-sm p-2.5 border transition-all duration-200 ${
                    isAgentHovered
                      ? 'border-nexus-blue shadow-nexus-hover -translate-y-0.5 scale-105'
                      : 'border-nexus-border shadow-nexus-subtle hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 rounded-md bg-nexus-bg border border-nexus-border flex items-center justify-center shrink-0">
                      {getAgentIcon(agent.id)}
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          agent.status === 'Active'
                            ? 'bg-nexus-green'
                            : agent.status === 'Analyzing'
                            ? 'bg-nexus-amber animate-pulse'
                            : agent.status === 'Awaiting approval'
                            ? 'bg-nexus-purple'
                            : 'bg-nexus-blue'
                        }`}
                      />
                      <span className="text-[8px] font-medium text-slate-400">{agent.status}</span>
                    </div>
                  </div>

                  <div className="mt-1.5 font-semibold text-[11px] text-nexus-navy leading-tight truncate">
                    {agent.name}
                  </div>
                  <div className="text-[9px] text-nexus-muted leading-tight truncate mt-0.5">
                    {agent.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
