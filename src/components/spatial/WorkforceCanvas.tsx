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
  Maximize2,
  Minimize2,
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
  const [zoom, setZoom] = useState<number>(0.9);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Departments that have their sub-nodes expanded
  const [expandedDeptIds, setExpandedDeptIds] = useState<DepartmentId[]>([
    'payment-ops',
    'merchant-growth',
  ]);
  const [hoveredDeptId, setHoveredDeptId] = useState<DepartmentId | null>(null);

  // Virtual canvas dimensions (center is 1000, 700)
  const canvasCenter: BranchPoint = useMemo(() => ({ x: 1000, y: 700 }), []);

  // Department node fixed spatial coordinates in virtual canvas space
  const departmentPositions: Record<DepartmentId, BranchPoint> = useMemo(() => {
    const cx = canvasCenter.x;
    const cy = canvasCenter.y;
    const radius = 290; // distance from core

    return {
      'payment-ops': {
        x: cx + radius * Math.cos((-30 * Math.PI) / 180),
        y: cy + radius * Math.sin((-30 * Math.PI) / 180),
      },
      'finance-recon': {
        x: cx + radius * Math.cos((35 * Math.PI) / 180),
        y: cy + radius * Math.sin((35 * Math.PI) / 180),
      },
      'intelligence-lab': {
        x: cx + radius * Math.cos((95 * Math.PI) / 180),
        y: cy + radius * Math.sin((95 * Math.PI) / 180),
      },
      'business-ops': {
        x: cx + radius * Math.cos((150 * Math.PI) / 180),
        y: cy + radius * Math.sin((150 * Math.PI) / 180),
      },
      'merchant-growth': {
        x: cx + radius * Math.cos((210 * Math.PI) / 180),
        y: cy + radius * Math.sin((210 * Math.PI) / 180),
      },
      'customer-success': {
        x: cx + radius * Math.cos((270 * Math.PI) / 180),
        y: cy + radius * Math.sin((270 * Math.PI) / 180),
      },
    };
  }, [canvasCenter]);

  // Compute sub-agent positions fanning outward from their department
  const subAgentPositions: Record<string, BranchPoint> = useMemo(() => {
    const positions: Record<string, BranchPoint> = {};
    const outwardRadius = 185; // distance from department node

    const deptAngles: Record<DepartmentId, number> = {
      'payment-ops': -30,
      'finance-recon': 35,
      'intelligence-lab': 95,
      'business-ops': 150,
      'merchant-growth': 210,
      'customer-success': 270,
    };

    departments.forEach((dept) => {
      const deptPos = departmentPositions[dept.id];
      const baseAngle = (deptAngles[dept.id] * Math.PI) / 180;
      const count = dept.agentIds.length;
      const arcSpread = Math.PI * 0.75; // fan span

      dept.agentIds.forEach((agentId, index) => {
        const offset = (index - (count - 1) / 2) * (arcSpread / Math.max(count - 1, 1));
        const angle = baseAngle + offset;
        positions[agentId] = {
          x: deptPos.x + outwardRadius * Math.cos(angle),
          y: deptPos.y + outwardRadius * Math.sin(angle),
        };
      });
    });

    return positions;
  }, [departments, departmentPositions]);

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
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.45), 2.2));
  }, []);

  const handleResetView = useCallback(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setZoom(0.9);
      setPan({
        x: clientWidth / 2 - canvasCenter.x * 0.9,
        y: clientHeight / 2 - canvasCenter.y * 0.9,
      });
    }
  }, [canvasCenter]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left mouse button on background
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
    setZoom((prev) => Math.min(Math.max(prev + zoomFactor, 0.45), 2.2));
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
              {expandedDeptIds.length === departments.length ? 'Collapse Tree' : 'Expand All'}
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
          width: '2000px',
          height: '1400px',
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
