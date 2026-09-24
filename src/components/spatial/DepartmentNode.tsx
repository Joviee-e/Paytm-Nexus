import React from 'react';
import { Department } from '../../types/nexus';
import {
  CreditCard,
  Scale,
  TrendingUp,
  Users,
  Layers,
  Cpu,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface DepartmentNodeProps {
  department: Department;
  position: { x: number; y: number };
  isHovered: boolean;
  isSelected: boolean;
  hasAttention: boolean;
  hasApproval: boolean;
  hasWorking: boolean;
  activeAlertCount: number;
  agentCount: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: (e: React.MouseEvent) => void;
}

export const DepartmentNode: React.FC<DepartmentNodeProps> = ({
  department,
  position,
  isHovered,
  isSelected,
  hasAttention,
  hasApproval,
  hasWorking,
  activeAlertCount,
  agentCount,
  onHoverStart,
  onHoverEnd,
  onClick,
}) => {
  // Render clean monochrome icon
  const renderIcon = () => {
    const props = { className: 'w-5 h-5 text-white stroke-[1.8]' };
    switch (department.iconName) {
      case 'CreditCard':
        return <CreditCard {...props} />;
      case 'Scale':
        return <Scale {...props} />;
      case 'TrendingUp':
        return <TrendingUp {...props} />;
      case 'Users':
        return <Users {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <div
      className="absolute cursor-pointer select-none transition-transform duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${isSelected ? 1.06 : isHovered ? 1.04 : 1})`,
        zIndex: isSelected ? 40 : 25,
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${department.name}, ${agentCount} sub-skills`}
    >
      <div className="relative flex flex-col items-center">
        {/* Crisp Solid Node Container */}
        <div
          className={`relative px-4 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 ${
            isSelected
              ? 'bg-[#22242C] border-2 border-white shadow-[0_4px_24px_rgba(0,0,0,0.8)]'
              : hasAttention
              ? 'bg-[#1C1D23] border border-amber-400 animate-status-amber'
              : hasApproval
              ? 'bg-[#1C1D23] border border-violet-400 animate-status-violet'
              : isHovered
              ? 'bg-[#202229] border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
              : 'bg-[#17181E] border border-white/20 hover:border-white/40'
          }`}
        >
          {/* Node Icon Box */}
          <div className="w-8 h-8 rounded-lg bg-[#252732] border border-white/10 flex items-center justify-center shrink-0">
            {renderIcon()}
          </div>

          {/* Department Name & Count */}
          <div className="flex flex-col pr-1">
            <span className="text-xs font-bold tracking-wider uppercase text-white font-mono whitespace-nowrap">
              {department.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-400 font-mono">
                {agentCount} skills
              </span>
              {hasAttention && (
                <span className="text-[9px] font-bold uppercase text-amber-400 px-1 rounded bg-amber-400/10 border border-amber-400/30">
                  Alert
                </span>
              )}
              {hasApproval && (
                <span className="text-[9px] font-bold uppercase text-violet-300 px-1 rounded bg-violet-400/10 border border-violet-400/30">
                  Approval
                </span>
              )}
            </div>
          </div>

          {/* Connected Expand/Collapse Toggle Indicator */}
          <div
            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] font-mono transition-colors ${
              isSelected
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-slate-400 border-white/25'
            }`}
          >
            {isSelected ? '−' : '+'}
          </div>
        </div>

        {/* Hover Descriptor Box */}
        {isHovered && !isSelected && (
          <div className="absolute top-full mt-2 pointer-events-none z-50 px-3 py-1.5 rounded-lg bg-[#14151A] border border-white/20 shadow-xl text-center max-w-[220px]">
            <p className="text-[11px] text-slate-300 leading-snug">
              {department.shortDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
