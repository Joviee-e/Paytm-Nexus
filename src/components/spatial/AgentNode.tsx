import React from 'react';
import { Agent, AgentStatus } from '../../types/nexus';
import {
  ShieldAlert,
  Search,
  Activity,
  BellRing,
  Receipt,
  RotateCcw,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Compass,
  BarChart3,
  Sparkles,
  Rocket,
  UserCheck,
  UserMinus,
  MessageSquareHeart,
  HeartHandshake,
  FileText,
  CheckSquare,
  FileCheck,
  GitMerge,
  Cpu,
  Network,
  ShieldCheck,
  Gauge,
  AlertTriangle,
  Clock,
  Check,
} from 'lucide-react';

interface AgentNodeProps {
  agent: Agent;
  position: { x: number; y: number };
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const AgentNode: React.FC<AgentNodeProps> = ({
  agent,
  position,
  isSelected,
  onClick,
}) => {
  // Render clean monochrome icon
  const renderIcon = () => {
    const props = { className: 'w-3.5 h-3.5 text-white stroke-[1.8]' };
    switch (agent.iconName) {
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      case 'Search':
        return <Search {...props} />;
      case 'Activity':
        return <Activity {...props} />;
      case 'BellRing':
        return <BellRing {...props} />;
      case 'Receipt':
        return <Receipt {...props} />;
      case 'RotateCcw':
        return <RotateCcw {...props} />;
      case 'DollarSign':
        return <DollarSign {...props} />;
      case 'CheckCircle2':
        return <CheckCircle2 {...props} />;
      case 'TrendingUp':
        return <TrendingUp {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'BarChart3':
        return <BarChart3 {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Rocket':
        return <Rocket {...props} />;
      case 'UserCheck':
        return <UserCheck {...props} />;
      case 'UserMinus':
        return <UserMinus {...props} />;
      case 'MessageSquareHeart':
        return <MessageSquareHeart {...props} />;
      case 'HeartHandshake':
        return <HeartHandshake {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'CheckSquare':
        return <CheckSquare {...props} />;
      case 'FileCheck':
        return <FileCheck {...props} />;
      case 'GitMerge':
        return <GitMerge {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'Network':
        return <Network {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Gauge':
        return <Gauge {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  // Status badge indicator
  const renderStatusDot = () => {
    switch (agent.status) {
      case 'attention':
        return <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />;
      case 'awaiting_approval':
        return <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />;
      case 'working':
        return <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />;
      case 'completed':
        return <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />;
      case 'idle':
      default:
        return <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />;
    }
  };

  return (
    <div
      className="absolute cursor-pointer select-none transition-transform duration-150"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${isSelected ? 1.08 : 1})`,
        zIndex: isSelected ? 45 : 30,
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${agent.name}, status: ${agent.status}`}
    >
      <div
        className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${
          isSelected
            ? 'bg-[#262832] border-2 border-white text-white shadow-xl'
            : agent.status === 'attention'
            ? 'bg-[#1C1D24] border border-amber-400 text-slate-100 animate-status-amber'
            : agent.status === 'awaiting_approval'
            ? 'bg-[#1C1D24] border border-violet-400 text-slate-100 animate-status-violet'
            : 'bg-[#16171D] border border-white/20 hover:border-white/50 text-slate-200'
        }`}
      >
        <div className="w-5 h-5 rounded bg-[#20222A] border border-white/10 flex items-center justify-center shrink-0">
          {renderIcon()}
        </div>

        <span className="text-[11px] font-semibold tracking-tight text-white whitespace-nowrap">
          {agent.name}
        </span>

        {renderStatusDot()}
      </div>
    </div>
  );
};
