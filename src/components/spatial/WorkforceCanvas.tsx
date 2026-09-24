import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNexus } from '../../context/NexusContext';
import { DepartmentId, Department } from '../../types/nexus';
import { DepartmentNode } from './DepartmentNode';
import { AgentNode } from './AgentNode';
import { TreeBranches, BranchPoint } from './TreeBranches';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  GitBranch,
} from 'lucide-react';

export const WorkforceCanvas: React.FC = () => {
  const {
    departments,
    agents,
    activeDepartmentId,
    activeAgentId,
    selectDepartment,
    selectAgent,
    returnToWorkforceMap,
    triggerActivation,
    isActivated,
  } = useNexus();

  // Canvas Pan & Zoom State
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(0.8);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Departments that have their sub-nodes expanded
  const [expandedDeptIds, setExpandedDeptIds] = useState<DepartmentId[]>([
    'payment-ops',
    'customer-success',
    'merchant-growth',
  ]);
  const [hoveredDeptId, setHoveredDeptId] = useState<DepartmentId | null>(null);

  // Virtual canvas dimensions (center is 1200, 950 in a 2500 x 1900 canvas)
  const canvasCenter: BranchPoint = useMemo(() => ({ x: 1200, y: 950 }), []);

  // Department node coordinates with generous breathing space (radius 360px from core)
  const departmentPositions: Record<DepartmentId, BranchPoint> = useMemo(() => {
    return {
      // Top: Customer Success (-90 deg)
      'customer-success': { x: 1200, y: 590 },
      // Top-Right: Payment Operations (-25 deg)
      'payment-ops': { x: 1530, y: 798 },
      // Bottom-Right: Finance & Reconciliation (35 deg)
      'finance-recon': { x: 1495, y: 1156 },
      // Bottom: Intelligence Lab (95 deg)
      'intelligence-lab': { x: 1170, y: 1309 },
      // Bottom-Left: Business Operations (150 deg)
      'business-ops': { x: 888, y: 1130 },
      // Top-Left: Merchant Growth (205 deg)
      'merchant-growth': { x: 874, y: 798 },
    };
  }, []);

  // Exact, collision-free sub-agent coordinates tailored for each department's sector
  const subAgentPositions: Record<string, BranchPoint> = useMemo(() => {
    return {
      // 1. Customer Success (Sector: Top, 240° to 300°)
      // Two clean tiers above department node (y = 590)
      'customer-segmenter': { x: 1060, y: 440 },
      'customer-support-agent': { x: 1340, y: 440 },
      'churn-predictor': { x: 1060, y: 300 },
      'retention-coordinator': { x: 1340, y: 300 },

      // 2. Payment Operations (Sector: Top-Right, -50° to +25°)
      // Fanning outward to the right away from dept (x = 1530, y = 798)
      'payment-sentinel': { x: 1750, y: 660 },
      'failure-investigator': { x: 1980, y: 610 },
      'payment-health-analyst': { x: 1830, y: 800 },
      'incident-coordinator': { x: 1780, y: 940 },

      // 3. Finance & Reconciliation (Sector: Bottom-Right, 20° to 75°)
      // Fanning bottom-right away from dept (x = 1495, y = 1156)
      'settlement-investigator': { x: 1760, y: 1110 },
      'refund-tracker': { x: 1810, y: 1260 },
      'financial-analyst': { x: 1670, y: 1360 },
      'reconciliation-coordinator': { x: 1490, y: 1450 },

      // 4. Intelligence Lab (Sector: Bottom, 70° to 120°)
      // Two tiers below department node (y = 1309)
      'anomaly-detection-engine': { x: 930, y: 1480 },
      'customer-intelligence-engine': { x: 1170, y: 1495 },
      'insight-generator': { x: 1410, y: 1480 },
      'revenue-forecasting-engine': { x: 930, y: 1630 },
      'merchant-profile-engine': { x: 1170, y: 1645 },
      'model-evaluation-engine': { x: 1410, y: 1630 },

      // 5. Business Operations (Sector: Bottom-Left, 115° to 180°)
      // Fanning bottom-left away from dept (x = 888, y = 1130)
      'daily-briefing-agent': { x: 888, y: 1380 },
      'task-coordinator': { x: 700, y: 1320 },
      'document-assistant': { x: 590, y: 1200 },
      'operations-coordinator': { x: 580, y: 1050 },

      // 6. Merchant Growth (Sector: Top-Left, 180° to 240°)
      // Fanning top-left away from dept (x = 874, y = 798)
      'revenue-forecaster': { x: 630, y: 920 },
      'opportunity-scout': { x: 560, y: 798 },
      'business-analyst': { x: 610, y: 660 },
      'campaign-strategist': { x: 720, y: 530 },
      'growth-coordinator': { x: 910, y: 460 },
    };
  }, []);

  // Map of departmentId to agentIds
  const departmentAgentMap = useMemo(() => {
    const map: Record<DepartmentId, string[]> = {} as any;
    departments.forEach((d) => {
      map[d.id] = d.agentIds;
    });
    return map;
  }, [departments]);

  // Center canvas on initial load
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setPan({
        x: clientWidth / 2 - canvasCenter.x * zoom,
        y: clientHeight / 2 - canvasCenter.y * zoom,
      });
    }
  }, [canvasCenter, zoom]);

  // Zoom handlers
  const handleZoom = useCallback((delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.4), 2.0));
  }, []);

  const handleResetView = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const targetZoom = clientWidth < 900 ? 0.6 : 0.8;
      setZoom(targetZoom);
      setPan({
        x: clientWidth / 2 - canvasCenter.x * targetZoom,
        y: clientHeight / 2 - canvasCenter.y * targetZoom,
      });
    }
  }, [canvasCenter]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(Math.max(prev + zoomFactor, 0.4), 2.0));
  };

  // Toggle department expansion
  const toggleDepartment = (deptId: DepartmentId) => {
    selectDepartment(deptId);
    setExpandedDeptIds((prev) =>
      prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]
    );
  };

  const expandAll = () => {
    setExpandedDeptIds(departments.map((d) => d.id));
  };

  const collapseAll = () => {
    setExpandedDeptIds([]);
    returnToWorkforceMap();
  };

  // Status flags helper
  const getDepartmentStatusFlags = (dept: Department) => {
    let hasAttention = false;
    let hasApproval = false;
    let hasWorking = false;
    let alertCount = 0;

    dept.agentIds.forEach((agentId) => {
      const ag = agents[agentId];
      if (!ag) return;
      if (ag.status === 'attention' || ag.status === 'critical') {
        hasAttention = true;
        alertCount++;
      } else if (ag.status === 'awaiting_approval') {
        hasApproval = true;
        alertCount++;
      } else if (ag.status === 'working') {
        hasWorking = true;
      }
    });

    return { hasAttention, hasApproval, hasWorking, alertCount };
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-screen h-screen overflow-hidden greasy-black-canvas select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-5 right-5 flex items-center justify-between pointer-events-none z-40">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#16171D] border border-white/20 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              Paytm Nexus
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              137 Skills • 6 Depts
            </span>
          </div>

          <button
            onClick={expandedDeptIds.length === departments.length ? collapseAll : expandAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191A22] border border-white/20 hover:border-white/40 text-xs font-mono text-slate-300 hover:text-white transition-colors shadow-md"
            title="Toggle All Department Branches"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>
              {expandedDeptIds.length === departments.length ? 'Collapse Tree' : 'Expand All Skills'}
            </span>
          </button>
        </div>

        {/* Zoom & Canvas Navigation Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#16171D] p-1 rounded-lg border border-white/20 shadow-md">
          <button
            onClick={() => handleZoom(0.12)}
            className="w-7 h-7 rounded bg-[#20222A] hover:bg-[#282A35] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-0.12)}
            className="w-7 h-7 rounded bg-[#20222A] hover:bg-[#282A35] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-slate-400 px-1.5">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleResetView}
            className="w-7 h-7 rounded bg-[#20222A] hover:bg-[#282A35] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            title="Center Canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* VIRTUAL ZOOMABLE & PANNABLE CANVAS CONTAINER */}
      {/* ========================================================== */}
      <div
        className="absolute origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: '2500px',
          height: '1900px',
        }}
      >
        {/* SVG Tree Connecting Branches */}
        <TreeBranches
          center={canvasCenter}
          departmentPositions={departmentPositions}
          subAgentPositions={subAgentPositions}
          activeDepartmentId={activeDepartmentId}
          activeAgentId={activeAgentId}
          expandedDeptIds={expandedDeptIds}
          departmentAgentMap={departmentAgentMap}
        />

        {/* ---------------------------------------------------------- */}
        {/* CENTRAL PAYTM NEXUS CORE NODE */}
        {/* ---------------------------------------------------------- */}
        <div
          className="absolute cursor-pointer select-none"
          style={{
            left: `${canvasCenter.x}px`,
            top: `${canvasCenter.y}px`,
            transform: 'translate(-50%, -50%)',
            zIndex: 35,
          }}
          onClick={(e) => {
            e.stopPropagation();
            triggerActivation();
          }}
          role="button"
          tabIndex={0}
          aria-label="Paytm Nexus Central Brain Core"
        >
          <div className="relative flex flex-col items-center">
            {/* Outer perimeter guide ring */}
            <div className="absolute -inset-2 rounded-full border border-white/10 pointer-events-none" />

            {/* Core Box */}
            <div className="w-28 h-28 rounded-2xl bg-[#1A1B22] border-2 border-white flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-transform hover:scale-105">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">
                PAYTM
              </span>
              <span className="text-sm font-black font-mono tracking-[0.15em] text-white uppercase mt-0.5">
                NEXUS
              </span>
              <span className="text-[8px] font-mono tracking-wider text-slate-400 uppercase mt-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                Core Brain
              </span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* 6 DEPARTMENT NODES */}
        {/* ---------------------------------------------------------- */}
        {departments.map((dept) => {
          const pos = departmentPositions[dept.id];
          const isSelected = expandedDeptIds.includes(dept.id);
          const isHovered = hoveredDeptId === dept.id;
          const statusFlags = getDepartmentStatusFlags(dept);

          return (
            <DepartmentNode
              key={dept.id}
              department={dept}
              position={pos}
              isHovered={isHovered}
              isSelected={isSelected}
              hasAttention={statusFlags.hasAttention}
              hasApproval={statusFlags.hasApproval}
              hasWorking={statusFlags.hasWorking}
              activeAlertCount={statusFlags.alertCount}
              agentCount={dept.agentIds.length}
              onHoverStart={() => setHoveredDeptId(dept.id)}
              onHoverEnd={() => setHoveredDeptId(null)}
              onClick={(e) => {
                e.stopPropagation();
                toggleDepartment(dept.id);
              }}
            />
          );
        })}

        {/* ---------------------------------------------------------- */}
        {/* SUB-AGENTS SATELLITE NODES */}
        {/* ---------------------------------------------------------- */}
        {expandedDeptIds.map((deptId) => {
          const agentIds = departmentAgentMap[deptId] || [];
          return agentIds.map((agentId) => {
            const agent = agents[agentId];
            const pos = subAgentPositions[agentId];
            if (!agent || !pos) return null;

            return (
              <AgentNode
                key={agent.id}
                agent={agent}
                position={pos}
                isSelected={activeAgentId === agent.id}
                onClick={(e) => {
                  e.stopPropagation();
                  selectAgent(agent.id);
                }}
              />
            );
          });
        })}
      </div>
    </div>
  );
};
