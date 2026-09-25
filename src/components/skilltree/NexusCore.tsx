import React, { useMemo } from 'react';
import type { Agent, AgentStatus, Department, DepartmentId } from '../../types/nexus';
import { DEPT_ANGLES } from '../../lib/skillTreeLayout';

// "The mind" at the centre of the map.
// Every agent is a small clump of glowing dots (one dot per skill), placed in the
// direction of its department. Two bright stars — Nexus and the Orchestrator —
// wire into every clump, and signals travel along those wires when agents work.
// Pure SVG + CSS / SMIL animation: nothing re-renders per frame.

export const MIND_RADIUS = 104;

interface Props {
  departments: Department[];
  agents: Record<string, Agent>;
  focusDept: DepartmentId | null;
  activeStatuses: AgentStatus[];
  statusColor: Record<AgentStatus, string>;
  pulseKey: number;
  onClick: () => void;
}

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const NEXUS = { x: 10, y: 14 };
const ORCH = { x: -22, y: -24 };

export const NexusCore: React.FC<Props> = ({
  departments,
  agents,
  focusDept,
  activeStatuses,
  statusColor,
  pulseKey,
  onClick,
}) => {
  const structureKey = departments.map((d) => d.agentIds.join(',')).join('|');

  const mind = useMemo(() => {
    const r = rng(7);
    const clumps: {
      agentId: string;
      deptId: DepartmentId;
      color: string;
      x: number;
      y: number;
      dots: { x: number; y: number; s: number; c: string; d: number }[];
      orch: boolean;
    }[] = [];
    const extraColors = ['#fbbf24', '#f87171', '#ffffff', '#e2e8f0'];

    departments.forEach((dept) => {
      const a0 = ((DEPT_ANGLES[dept.id] ?? 0) * Math.PI) / 180;
      const ids = dept.agentIds.filter((id) => agents[id]);
      ids.forEach((id, i) => {
        const n = ids.length;
        const t = n === 1 ? 0 : i / (n - 1) - 0.5;
        const ang = a0 + t * 0.95 + (r() - 0.5) * 0.2;
        const rad = 40 + (i % 3) * 21 + r() * 12;
        const cx = Math.cos(ang) * rad;
        const cy = Math.sin(ang) * rad;
        const count = agents[id].capabilities.length + 4;
        const dots = Array.from({ length: count }, (_, k) => {
          const da = r() * Math.PI * 2;
          const dr = 2 + r() * 9;
          const c = k === 0 ? '#ffffff' : r() < 0.55 ? dept.accentColor : extraColors[Math.floor(r() * extraColors.length)];
          return { x: cx + Math.cos(da) * dr, y: cy + Math.sin(da) * dr, s: k === 0 ? 1.7 : 0.8 + r() * 1.0, c, d: r() * 6 };
        });
        clumps.push({ agentId: id, deptId: dept.id, color: dept.accentColor, x: cx, y: cy, dots, orch: i % 2 === 0 });
      });
    });

    // loose dust between the clumps
    const palette = [...departments.map((d) => d.accentColor), '#fbbf24', '#ffffff', '#ffffff'];
    const dust = Array.from({ length: 150 }, (_, i) => {
      const a = r() * Math.PI * 2;
      const rad = Math.pow(r(), 0.7) * MIND_RADIUS;
      return {
        i,
        x: Math.cos(a) * rad,
        y: Math.sin(a) * rad,
        s: 0.5 + r() * 0.9,
        c: palette[Math.floor(r() * palette.length)],
        op: 0.25 + r() * 0.5,
        dx: (r() - 0.5) * 6,
        dy: (r() - 0.5) * 6,
        dur: 5 + r() * 6,
        delay: -r() * 8,
      };
    });
    return { clumps, dust };
  }, [structureKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const dim = (deptId: DepartmentId) => (focusDept && focusDept !== deptId ? 0.18 : 1);

  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label="Paytm Nexus core"
      className="nx-fade"
    >
      <defs>
        <radialGradient id="nx-mind-glow">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.16" />
          <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id="nx-bloom" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle r={MIND_RADIUS + 34} fill="url(#nx-mind-glow)" />

      {/* slow rotation keeps the mind alive without moving the branches */}
      <g className="nx-mind-spin">
        {/* dust */}
        {mind.dust.map((p) => (
          <circle
            key={p.i}
            cx={p.x}
            cy={p.y}
            r={p.s}
            fill={p.c}
            opacity={p.op}
            className="nx-particle"
            style={
              {
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* wires: stars -> every agent clump */}
        {mind.clumps.map((c) => (
          <g key={`w-${c.agentId}`} style={{ opacity: dim(c.deptId), transition: 'opacity 350ms ease' }}>
            <line x1={NEXUS.x} y1={NEXUS.y} x2={c.x} y2={c.y} stroke="rgba(255,255,255,0.22)" strokeWidth={0.45} vectorEffect="non-scaling-stroke" />
            {c.orch && (
              <line x1={ORCH.x} y1={ORCH.y} x2={c.x} y2={c.y} stroke="rgba(251,191,36,0.18)" strokeWidth={0.45} vectorEffect="non-scaling-stroke" />
            )}
          </g>
        ))}
        <line x1={NEXUS.x} y1={NEXUS.y} x2={ORCH.x} y2={ORCH.y} stroke="rgba(255,255,255,0.35)" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />

        {/* clumps (one per agent, one dot per skill) */}
        {mind.clumps.map((c) => {
          const status = agents[c.agentId]?.status ?? 'idle';
          const busy = activeStatuses.includes(status);
          return (
            <g key={c.agentId} style={{ opacity: dim(c.deptId), transition: 'opacity 350ms ease' }}>
              {c.dots.map((d, k) => (
                <circle
                  key={k}
                  cx={d.x}
                  cy={d.y}
                  r={k === 0 && busy ? 2.2 : d.s}
                  fill={k === 0 && busy ? statusColor[status] : d.c}
                  className="nx-twinkle"
                  style={{ animationDelay: `${d.d}s` }}
                />
              ))}
              {busy && (
                <circle r={1.6} fill={statusColor[status]} filter="url(#nx-bloom)">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path={`M${NEXUS.x},${NEXUS.y} L${c.x},${c.y}`} />
                </circle>
              )}
            </g>
          );
        })}
      </g>

      {/* the two bright stars */}
      <g filter="url(#nx-bloom)">
        <circle cx={ORCH.x} cy={ORCH.y} r={4.2} fill="#f59e0b" className="nx-star" />
        <circle cx={NEXUS.x} cy={NEXUS.y} r={3.6} fill="#ffffff" className="nx-star" style={{ animationDelay: '-1.4s' }} />
      </g>

      {/* activation ripple — remounts on every click */}
      <circle key={pulseKey} cx={NEXUS.x} cy={NEXUS.y} r={10} fill="none" stroke="#a7f3d0" strokeWidth={1} className="nx-ripple" vectorEffect="non-scaling-stroke" />
      <circle r={MIND_RADIUS * 0.7} fill="transparent" />
    </g>
  );
};
