import React from 'react';
import { DepartmentId } from '../../types/nexus';

export interface BranchPoint {
  x: number;
  y: number;
}

interface TreeBranchesProps {
  center: BranchPoint;
  departmentPositions: Record<DepartmentId, BranchPoint>;
  subAgentPositions: Record<string, BranchPoint>;
  activeDepartmentId: DepartmentId | null;
  activeAgentId: string | null;
  expandedDeptIds: DepartmentId[];
  departmentAgentMap: Record<DepartmentId, string[]>;
}

export const TreeBranches: React.FC<TreeBranchesProps> = ({
  center,
  departmentPositions,
  subAgentPositions,
  activeDepartmentId,
  activeAgentId,
  expandedDeptIds,
  departmentAgentMap,
}) => {
  // Generate smooth organic cubic bezier path between two points
  const createBranchPath = (p1: BranchPoint, p2: BranchPoint): string => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    // Control points biased along the vector with slight natural curve
    const cx1 = p1.x + dx * 0.45;
    const cy1 = p1.y + dy * 0.15;
    const cx2 = p1.x + dx * 0.55;
    const cy2 = p1.y + dy * 0.85;

    return `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
      <defs>
        {/* Crisp linear gradient for active branches */}
        <linearGradient id="activeBranchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* 1. Primary Branches: Core -> Department Nodes */}
      {Object.entries(departmentPositions).map(([deptId, deptPos]) => {
        const isTargetActive = activeDepartmentId === deptId;
        const isAgentInDept =
          activeAgentId && departmentAgentMap[deptId as DepartmentId]?.includes(activeAgentId);
        const isHighlighted = isTargetActive || isAgentInDept;

        const path = createBranchPath(center, deptPos);

        return (
          <g key={`core-to-${deptId}`}>
            {/* Background base branch */}
            <path
              d={path}
              fill="none"
              stroke={isHighlighted ? '#FFFFFF' : '#2D3039'}
              strokeWidth={isHighlighted ? 2.5 : 1.5}
              strokeOpacity={isHighlighted ? 1 : 0.65}
              className="transition-all duration-300"
            />

            {/* Animated signal pulse along active branch */}
            {isHighlighted && (
              <path
                d={path}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={2}
                className="animate-branch-flow"
              />
            )}
          </g>
        );
      })}

      {/* 2. Secondary Branches: Department Node -> Sub-Agent Nodes */}
      {expandedDeptIds.map((deptId) => {
        const deptPos = departmentPositions[deptId];
        const agentIds = departmentAgentMap[deptId] || [];
        if (!deptPos) return null;

        return agentIds.map((agentId) => {
          const agentPos = subAgentPositions[agentId];
          if (!agentPos) return null;

          const isAgentSelected = activeAgentId === agentId;
          const isDeptActive = activeDepartmentId === deptId;
          const isHighlighted = isAgentSelected;

          const path = createBranchPath(deptPos, agentPos);

          return (
            <g key={`dept-to-${agentId}`}>
              {/* Branch line */}
              <path
                d={path}
                fill="none"
                stroke={isHighlighted ? '#FFFFFF' : isDeptActive ? '#4A4E5A' : '#262830'}
                strokeWidth={isHighlighted ? 2.2 : 1.2}
                strokeOpacity={isHighlighted ? 1 : 0.7}
                strokeDasharray={isHighlighted ? undefined : '3 3'}
                className="transition-all duration-300"
              />

              {/* Animated active branch signal */}
              {isHighlighted && (
                <path
                  d={path}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  className="animate-branch-flow"
                />
              )}
            </g>
          );
        });
      })}
    </svg>
  );
};
