import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import type { AgentStatus, DepartmentId } from '../../types/nexus';
import { buildSkillTree, DEPT_ANGLES, DEPT_ORDER, LNode, R_HUB, textWidth } from '../../lib/skillTreeLayout';
import { NexusCore, MIND_RADIUS } from './NexusCore';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Scale,
  TrendingUp,
  Users,
  Layers,
  Cpu,
  Plus,
  Minus,
  Maximize2,
  GitMerge,
  GitBranch,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// constants
// ---------------------------------------------------------------------------

const DEPT_ICONS: Record<DepartmentId, React.FC<any>> = {
  'payment-ops': CreditCard,
  'finance-recon': Scale,
  'merchant-growth': TrendingUp,
  'customer-success': Users,
  'business-ops': Layers,
  'intelligence-lab': Cpu,
};

// single-word labels on the map itself (the switcher shows the full name)
const DEPT_SHORT: Record<DepartmentId, string> = {
  'payment-ops': 'PAYMENTS',
  'finance-recon': 'FINANCE',
  'merchant-growth': 'GROWTH',
  'customer-success': 'CUSTOMERS',
  'business-ops': 'OPERATIONS',
  'intelligence-lab': 'INTELLIGENCE',
};

const DEPT_TAGS: Record<DepartmentId, string> = {
  'payment-ops': 'monitor · investigate · incidents',
  'finance-recon': 'settlements · refunds · books',
  'merchant-growth': 'forecast · opportunities · campaigns',
  'customer-success': 'segments · churn · retention',
  'business-ops': 'briefings · tasks · documents',
  'intelligence-lab': 'models · memory · evaluation',
};

const STATUS_COLOR: Record<AgentStatus, string> = {
  idle: '#e2e8f0',
  working: '#38bdf8',
  attention: '#f59e0b',
  critical: '#ef4444',
  awaiting_approval: '#a78bfa',
  completed: '#34d399',
  failed: '#ef4444',
};

const STATUS_LABEL: Record<AgentStatus, string> = {
  idle: 'Idle · monitoring',
  working: 'Working',
  attention: 'Needs attention',
  critical: 'Critical',
  awaiting_approval: 'Awaiting your approval',
  completed: 'Completed',
  failed: 'Failed',
};

const LOUD: AgentStatus[] = ['attention', 'critical', 'awaiting_approval', 'failed'];
const ACTIVE: AgentStatus[] = ['working', 'attention', 'critical', 'awaiting_approval'];

const TOP = 64; // room for the floating top bar

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

interface PlacedLabel {
  key: string;
  text: string;
  x: number;
  y: number;
  anchor: 'start' | 'end' | 'middle';
  size: number;
  kind: 'agent' | 'leaf';
  color: string;
}

// ---------------------------------------------------------------------------

export const SkillTreeMap: React.FC = () => {
  const {
    departments,
    agents,
    activeDepartmentId,
    activeAgentId,
    selectDepartment,
    selectAgent,
    triggerActivation,
    activationCount,
    openWorkflow,
  } = useNexus();

  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1280, h: 720 });
  const [hoverDept, setHoverDept] = useState<DepartmentId | null>(null);
  const [hoverAgent, setHoverAgent] = useState<string | null>(null);
  const [userZoom, setUserZoom] = useState(1);
  const [userPan, setUserPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [wheeling, setWheeling] = useState(false);
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number; moved: boolean } | null>(null);
  const wheelTimer = useRef<number | undefined>(undefined);

  // layout only depends on structure (not status) so it is stable across demo states
  const structureKey = departments.map((d) => d.agentIds.join(',')).join('|');
  const layout = useMemo(() => buildSkillTree(departments, agents), [structureKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- expand / collapse -----------------------------------------------------
  const [expanded, setExpanded] = useState<Set<DepartmentId>>(() => new Set(DEPT_ORDER));
  const allExpanded = expanded.size === departments.length;
  const [booted, setBooted] = useState(false);
  const [logoOk, setLogoOk] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setBooted(true), 2400);
    return () => window.clearTimeout(t);
  }, []);
  // focusing a collapsed department opens it
  useEffect(() => {
    if (activeDepartmentId && !expanded.has(activeDepartmentId)) {
      setExpanded((prev) => new Set(prev).add(activeDepartmentId));
    }
  }, [activeDepartmentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const vis = useMemo(() => {
    const nodes = layout.nodes.filter((n) => n.kind === 'dept' || expanded.has(n.deptId));
    const edges = layout.edges.filter((e) => e.kind === 'trunk' || expanded.has(e.deptId));
    const labels = layout.labels.map((l) => {
      if (expanded.has(l.deptId)) return l;
      const a = ((DEPT_ANGLES[l.deptId] ?? 0) * Math.PI) / 180;
      return { ...l, x: Math.cos(a) * (R_HUB + 46), y: Math.sin(a) * (R_HUB + 46) };
    });
    let ex = 0;
    let ey = 0;
    nodes.forEach((n) => {
      ex = Math.max(ex, Math.abs(n.x) + 30);
      ey = Math.max(ey, Math.abs(n.y) + 30);
    });
    return { nodes, edges, labels, ex, ey };
  }, [layout, expanded]);

  const toggleTree = () => {
    if (allExpanded) {
      setExpanded(new Set());
      selectDepartment(null);
    } else {
      setExpanded(new Set(DEPT_ORDER));
    }
    setUserZoom(1);
    setUserPan({ x: 0, y: 0 });
  };

  const deptById = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d])), [departments]);
  const totalSkills = useMemo(
    () => Object.values(agents).reduce((s, a) => s + a.capabilities.length, 0),
    [agents]
  );

  // ---- size ---------------------------------------------------------------
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // ---- view (fit / focus) ---------------------------------------------------
  const panelW = activeAgentId && size.w >= 768 ? (size.w >= 1024 ? 520 : 480) : 0;
  const effW = size.w - panelW;
  const effH = size.h - 70 - TOP; // top bar + department switcher
  const compact = size.w < 640;
  const deptPx = compact ? 11 : 15;
  const deptSpacing = compact ? 2 : 4.5;

  const base = useMemo(() => {
    // labels are drawn at a fixed screen size, so reserve their width in pixels
    const labelW =
      Math.max(
        ...departments.map((d) =>
          Math.max(textWidth(DEPT_SHORT[d.id], deptPx, deptSpacing), compact ? 0 : DEPT_TAGS[d.id].length * 5.9)
        )
      ) + 16;
    const fitK = Math.max(
      0.12,
      Math.min((effW - 2 * labelW) / (2 * (vis.ex + 20)), (effH - 60) / (2 * (vis.ey + 20)))
    );
    if (!activeDepartmentId) return { cx: 0, cy: 0, k: fitK };
    const pts = vis.nodes.filter((n) => n.deptId === activeDepartmentId);
    const lbl = vis.labels.find((l) => l.deptId === activeDepartmentId);
    const xs = pts.map((p) => p.x).concat(lbl ? [lbl.x] : []);
    const ys = pts.map((p) => p.y).concat(lbl ? [lbl.y] : []);
    const hub = layout.byId[`dept:${activeDepartmentId}`];
    xs.push(hub.x * 0.6);
    ys.push(hub.y * 0.6);
    const minX = Math.min(...xs) - 150;
    const maxX = Math.max(...xs) + 150;
    const minY = Math.min(...ys) - 60;
    const maxY = Math.max(...ys) + 60;
    const k = Math.min(effW / (maxX - minX), effH / (maxY - minY), fitK * 2.6);
    return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, k: Math.max(k, fitK) };
  }, [layout, vis, activeDepartmentId, effW, effH, departments, deptPx, deptSpacing, compact]);

  // reset manual pan/zoom whenever the focus changes
  useEffect(() => {
    setUserZoom(1);
    setUserPan({ x: 0, y: 0 });
  }, [activeDepartmentId, activeAgentId]);

  const K = base.k * userZoom;
  const tx = effW / 2 - base.cx * K + userPan.x;
  const ty = TOP + effH / 2 - base.cy * K + userPan.y;

  // ---- interaction: drag + wheel -------------------------------------------
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      setUserZoom((uz) => {
        const next = Math.min(Math.max(uz * (e.deltaY < 0 ? 1.12 : 1 / 1.12), 0.5), 4);
        const k0 = base.k * uz;
        const k1 = base.k * next;
        setUserPan((p) => {
          const curTx = effW / 2 - base.cx * k0 + p.x;
          const curTy = TOP + effH / 2 - base.cy * k0 + p.y;
          const wx = (sx - curTx) / k0;
          const wy = (sy - curTy) / k0;
          return {
            x: sx - wx * k1 - (effW / 2 - base.cx * k1),
            y: sy - wy * k1 - (TOP + effH / 2 - base.cy * k1),
          };
        });
        return next;
      });
      setWheeling(true);
      window.clearTimeout(wheelTimer.current);
      wheelTimer.current = window.setTimeout(() => setWheeling(false), 160);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [base, effW, effH]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { sx: e.clientX, sy: e.clientY, px: userPan.x, py: userPan.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) > 4) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) setUserPan({ x: d.px + dx, y: d.py + dy });
  };
  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    setDragging(false);
    return d?.moved ?? false;
  };
  const wasDrag = useRef(false);

  // ---- department switcher --------------------------------------------------
  const cycle = useCallback(
    (dir: 1 | -1) => {
      const idx = activeDepartmentId ? DEPT_ORDER.indexOf(activeDepartmentId) : dir === 1 ? -1 : 0;
      const next = DEPT_ORDER[(idx + dir + DEPT_ORDER.length) % DEPT_ORDER.length];
      selectDepartment(next);
    },
    [activeDepartmentId, selectDepartment]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight') cycle(1);
      if (e.key === 'ArrowLeft') cycle(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cycle]);

  // ---- highlight logic -----------------------------------------------------
  const hoverAgentDept: DepartmentId | null = hoverAgent && agents[hoverAgent] ? agents[hoverAgent].departmentId : null;
  const focusDept: DepartmentId | null = hoverDept || hoverAgentDept || activeDepartmentId;
  const focusAgent = hoverAgent ?? activeAgentId;

  const nodeOpacity = (n: { deptId: DepartmentId; agentId?: string }) => {
    if (focusDept && n.deptId !== focusDept) return 0.14;
    if (focusAgent && n.agentId && n.agentId !== focusAgent && agents[focusAgent]?.departmentId === n.deptId)
      return 0.4;
    return 1;
  };

  // ---- labels (placed greedily in world space so they never overlap) --------
  const labels = useMemo<PlacedLabel[]>(() => {
    const out: PlacedLabel[] = [];
    const placed: Box[] = [];
    const px = (p: number) => p / K;

    // obstacles: department labels, hubs, core
    vis.labels.forEach((l) => {
      const w = Math.max(
        textWidth(DEPT_SHORT[l.deptId], px(deptPx), px(deptSpacing)),
        compact ? 0 : px(DEPT_TAGS[l.deptId].length * 5.9)
      );
      const x = l.anchor === 'start' ? l.x : l.anchor === 'end' ? l.x - w : l.x - w / 2;
      placed.push({ x: x - px(4), y: l.y - px(18), w: w + px(8), h: px(46) });
    });
    vis.nodes
      .filter((n) => n.kind === 'dept')
      .forEach((n) => placed.push({ x: n.x - 26, y: n.y - 26, w: 52, h: 52 }));
    placed.push({ x: -MIND_RADIUS, y: -MIND_RADIUS, w: 2 * MIND_RADIUS, h: 2 * MIND_RADIUS });

    const dots = vis.nodes.filter((n) => n.kind === 'agent' || n.kind === 'leaf');

    const want: { node: LNode; text: string; size: number; kind: 'agent' | 'leaf'; color: string }[] = [];
    const agentNodes = vis.nodes.filter((n) => n.kind === 'agent');
    // 1. leaves of the focused agent
    if (focusAgent) {
      vis.nodes
        .filter((n) => n.kind === 'leaf' && n.agentId === focusAgent)
        .forEach((n) => want.push({ node: n, text: n.label ?? '', size: 10.5, kind: 'leaf', color: '#94a3b8' }));
    }
    // 2. agent names: focused department, plus anything asking for attention
    agentNodes.forEach((n) => {
      const a = agents[n.agentId!];
      if (!a) return;
      const show = n.deptId === focusDept || LOUD.includes(a.status);
      if (!show) return;
      const isFocus = n.agentId === focusAgent;
      want.push({
        node: n,
        text: a.name,
        size: isFocus ? 12.5 : 11.5,
        kind: 'agent',
        color: LOUD.includes(a.status) ? STATUS_COLOR[a.status] : '#f1f5f9',
      });
    });
    // 3. when a department is focused (zoomed), also try its skills
    if (activeDepartmentId && !activeAgentId) {
      vis.nodes
        .filter((n) => n.kind === 'leaf' && n.deptId === activeDepartmentId && n.agentId !== focusAgent)
        .forEach((n) => want.push({ node: n, text: n.label ?? '', size: 10, kind: 'leaf', color: '#64748b' }));
    }
    // focused agent's own name first, then leaves, then the rest
    want.sort((a, b) => {
      const rank = (x: typeof a) =>
        x.node.agentId === focusAgent ? (x.kind === 'agent' ? 0 : 1) : x.kind === 'agent' ? 2 : 3;
      const pa = rank(a);
      const pb = rank(b);
      return pa - pb;
    });

    want.forEach(({ node, text, size, kind, color }) => {
      const s = px(size);
      const w = textWidth(text, s);
      const h = s * 1.3;
      const gap = px(9);
      const right = Math.cos(Math.atan2(node.y, node.x)) >= 0;
      const cands: { x: number; y: number; anchor: PlacedLabel['anchor'] }[] = [];
      const side = (r: boolean, dy: number) => ({ x: node.x + (r ? gap : -gap), y: node.y + dy, anchor: (r ? 'start' : 'end') as PlacedLabel['anchor'] });
      cands.push(side(right, 0), side(right, -h * 0.9), side(right, h * 0.9));
      cands.push({ x: node.x, y: node.y - gap - s * 0.2, anchor: 'middle' });
      cands.push({ x: node.x, y: node.y + gap + s * 0.9, anchor: 'middle' });
      cands.push(side(!right, 0), side(right, -h * 1.8), side(right, h * 1.8));

      for (const c of cands) {
        const bx = c.anchor === 'start' ? c.x : c.anchor === 'end' ? c.x - w : c.x - w / 2;
        const box = { x: bx - px(2), y: c.y - s * 0.85, w: w + px(4), h };
        if (placed.some((p) => overlaps(p, box))) continue;
        const hitsDot = dots.some((d) => {
          if (d.id === node.id) return false;
          const r = px(4);
          return overlaps(box, { x: d.x - r, y: d.y - r, w: 2 * r, h: 2 * r });
        });
        if (hitsDot) continue;
        placed.push(box);
        out.push({ key: `${node.id}`, text, x: c.x, y: c.y, anchor: c.anchor, size: s, kind, color });
        break;
      }
    });
    return out;
  }, [layout, vis, K, focusAgent, focusDept, agents, deptPx, deptSpacing, activeDepartmentId, activeAgentId, compact]);

  // ---- hover card ------------------------------------------------------------
  const cardAgent = hoverAgent ? agents[hoverAgent] : null;

  const transition = dragging
    ? 'none'
    : wheeling
      ? 'transform 90ms linear'
      : 'transform 900ms cubic-bezier(.22,.8,.18,1)';

  const agentCount = Object.keys(agents).length;
  const shownDept = activeDepartmentId ? deptById[activeDepartmentId] : null;

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0b0e15]">
      {/* ================= MAP ================= */}
      <div
        ref={wrapRef}
        className={`relative flex-1 overflow-hidden nx-space ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => {
          wasDrag.current = onPointerUp();
        }}
        onPointerLeave={() => {
          onPointerUp();
        }}
        onClick={() => {
          if (wasDrag.current) {
            wasDrag.current = false;
            return;
          }
          if (activeAgentId) selectAgent(null);
          else if (activeDepartmentId) selectDepartment(null);
        }}
      >
        {/* ================= TOP BAR ================= */}
        <div
          className="absolute top-4 left-4 right-4 sm:left-6 sm:right-6 z-30 flex items-center justify-between gap-2 pointer-events-none"
          style={{ marginRight: panelW ? panelW + 8 : undefined }}
        >
          <div
            className="flex items-center gap-2 pointer-events-auto min-w-0"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="nx-pill">
              {logoOk ? (
                <img
                  src="/nexus-logo.png"
                  alt=""
                  className="h-[18px] w-auto max-w-[96px] object-contain"
                  onError={() => setLogoOk(false)}
                />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              )}
              <span className="font-mono font-bold text-[13px] tracking-[0.06em] text-white whitespace-nowrap">PAYTM NEXUS</span>
              <span className="hidden sm:inline font-mono text-[11.5px] text-slate-400 whitespace-nowrap">
                {agentCount} Agents · {totalSkills} Skills · {departments.length} Depts
              </span>
            </div>
            <button className="nx-pill nx-pill-btn" onClick={toggleTree} title={allExpanded ? 'Fold every branch into the mind' : 'Grow every branch'}>
              <GitBranch className="w-4 h-4" />
              <span className="hidden sm:inline font-mono text-[12.5px] whitespace-nowrap">
                {allExpanded ? 'Collapse Tree' : 'Expand All Skills'}
              </span>
            </button>
          </div>

          <div
            className="flex items-center gap-2 pointer-events-auto"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={openWorkflow} className="nx-pill nx-pill-btn" title="Open multi-agent workflow (W)">
              <GitMerge className="w-4 h-4" />
              <span className="hidden md:inline font-mono text-[12.5px]">Workflow</span>
            </button>
            <div className="nx-pill !p-1 !gap-0.5">
              <button className="nx-icon-btn" onClick={() => setUserZoom((z) => Math.min(z * 1.25, 4))} aria-label="Zoom in">
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button className="nx-icon-btn" onClick={() => setUserZoom((z) => Math.max(z / 1.25, 0.5))} aria-label="Zoom out">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                className="nx-icon-btn"
                onClick={() => {
                  selectDepartment(null);
                  setUserZoom(1);
                  setUserPan({ x: 0, y: 0 });
                }}
                aria-label="Show whole map"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <svg width={size.w} height={size.h} className="absolute inset-0 block" data-testid="skilltree">
          <g style={{ transform: `translate(${tx}px, ${ty}px) scale(${K})`, transition }}>
            {/* ---- edges ---- */}
            <g>
              {vis.edges.map((e, i) => {
                const a = layout.byId[e.from];
                const b = layout.byId[e.to];
                if (!a || !b) return null;
                const dept = deptById[e.deptId];
                const op = nodeOpacity({ deptId: e.deptId, agentId: e.agentId });
                const lit = focusAgent && e.agentId === focusAgent;
                const stroke =
                  e.kind === 'trunk'
                    ? 'rgba(255,255,255,0.32)'
                    : e.to.startsWith('joint:')
                      ? dept?.accentColor ?? '#fff'
                      : lit
                        ? 'rgba(255,255,255,0.75)'
                        : 'rgba(226,232,240,0.38)';
                const di = DEPT_ORDER.indexOf(e.deptId);
                return (
                  <line
                    key={e.id}
                    x1={e.kind === 'trunk' ? (b.x / Math.hypot(b.x, b.y)) * (MIND_RADIUS + 6) : a.x}
                    y1={e.kind === 'trunk' ? (b.y / Math.hypot(b.x, b.y)) * (MIND_RADIUS + 6) : a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={stroke}
                    strokeOpacity={e.to.startsWith('joint:') ? 0.55 : 1}
                    strokeWidth={lit ? 1.3 : 0.8}
                    strokeDasharray={e.kind === 'trunk' ? '1 5' : undefined}
                    vectorEffect="non-scaling-stroke"
                    className={e.kind === 'trunk' ? 'nx-fade' : 'nx-draw'}
                    style={{
                      opacity: op,
                      transition: 'opacity 350ms ease, stroke 350ms ease',
                      animationDelay: booted ? `${e.kind === 'twig' ? 0.25 : 0}s` : `${0.25 + di * 0.12 + (e.kind === 'twig' ? 0.45 : 0) + (i % 7) * 0.02}s`,
                    }}
                  />
                );
              })}
            </g>

            {/* ---- signals travelling from the mind out to each department ---- */}
            <g pointerEvents="none">
              {vis.nodes
                .filter((n) => n.kind === 'dept')
                .map((hub, i) => {
                  const len = Math.hypot(hub.x, hub.y);
                  const sx = (hub.x / len) * MIND_RADIUS;
                  const sy = (hub.y / len) * MIND_RADIUS;
                  const dept = deptById[hub.deptId];
                  return (
                    <circle
                      key={`sig-${hub.id}`}
                      r={1.8}
                      fill={dept.accentColor}
                      filter="url(#nx-bloom)"
                      style={{ opacity: nodeOpacity({ deptId: hub.deptId }), transition: 'opacity 350ms ease' }}
                    >
                      <animateMotion
                        dur="2.6s"
                        begin={`${i * 0.45}s`}
                        repeatCount="indefinite"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                        path={`M${sx},${sy} L${hub.x - (hub.x / len) * 18},${hub.y - (hub.y / len) * 18}`}
                      />
                      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="2.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
                    </circle>
                  );
                })}
            </g>

            {/* ---- activity flows along the branch of busy agents ---- */}
            <g pointerEvents="none">
              {Object.values(agents)
                .filter((a) => ACTIVE.includes(a.status))
                .map((a) => {
                  const hub = layout.byId[`dept:${a.departmentId}`];
                  const j = layout.byId[`joint:${a.id}`];
                  const n = layout.byId[`agent:${a.id}`];
                  if (!hub || !j || !n) return null;
                  return (
                    <polyline
                      key={`flow-${a.id}-${a.status}`}
                      points={`${(hub.x / Math.hypot(hub.x, hub.y)) * MIND_RADIUS},${(hub.y / Math.hypot(hub.x, hub.y)) * MIND_RADIUS} ${hub.x},${hub.y} ${j.x},${j.y} ${n.x},${n.y}`}
                      fill="none"
                      stroke={STATUS_COLOR[a.status]}
                      strokeWidth={1.4}
                      vectorEffect="non-scaling-stroke"
                      className="nx-flow"
                      style={{ opacity: nodeOpacity({ deptId: a.departmentId }) * 0.9 }}
                    />
                  );
                })}
            </g>

            {/* ---- core ---- */}
            <NexusCore
              departments={departments}
              agents={agents}
              focusDept={focusDept}
              activeStatuses={ACTIVE}
              statusColor={STATUS_COLOR}
              pulseKey={activationCount}
              onClick={triggerActivation}
            />

            {/* ---- nodes ---- */}
            {vis.nodes.map((n, i) => {
              const op = nodeOpacity(n);
              const di = DEPT_ORDER.indexOf(n.deptId);
              const delay = booted
                ? `${n.kind === 'leaf' ? 0.35 : n.kind === 'agent' ? 0.15 : 0}s`
                : `${0.35 + di * 0.12 + (n.kind === 'leaf' ? 0.55 : n.kind === 'agent' ? 0.3 : 0) + (i % 5) * 0.03}s`;

              if (n.kind === 'dept') {
                const dept = deptById[n.deptId];
                const Icon = DEPT_ICONS[n.deptId];
                const loud = dept.agentIds.find((id) => agents[id] && LOUD.includes(agents[id].status));
                const isActive = activeDepartmentId === n.deptId;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x} ${n.y})`}
                    className="nx-pop nx-hit"
                    style={{ opacity: op, transition: 'opacity 350ms ease', animationDelay: `${0.2 + di * 0.12}s` }}
                    onPointerEnter={() => setHoverDept(n.deptId)}
                    onPointerLeave={() => setHoverDept(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (wasDrag.current) return;
                      selectDepartment(isActive ? null : n.deptId);
                    }}
                    role="button"
                    aria-label={`${dept.name} department`}
                  >
                    {loud && (
                      <circle r={24} fill="none" stroke={STATUS_COLOR[agents[loud].status]} strokeWidth={1.2} className="nx-ring-pulse" vectorEffect="non-scaling-stroke" />
                    )}
                    <circle r={isActive ? 24 : 22} fill="none" stroke="rgba(255,255,255,0.10)" vectorEffect="non-scaling-stroke" />
                    <circle r={17} fill="#0d1119" stroke={dept.accentColor} strokeOpacity={0.9} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
                    <Icon x={-7.5} y={-7.5} width={15} height={15} color={dept.accentColor} strokeWidth={1.8} />
                    <circle r={30} fill="transparent" />
                  </g>
                );
              }

              if (n.kind === 'joint') {
                const dept = deptById[n.deptId];
                return (
                  <circle
                    key={n.id}
                    cx={n.x}
                    cy={n.y}
                    r={2.1}
                    fill={dept.accentColor}
                    className="nx-pop"
                    style={{ opacity: op, transition: 'opacity 350ms ease', animationDelay: delay }}
                  />
                );
              }

              if (n.kind === 'agent') {
                const a = agents[n.agentId!];
                if (!a) return null;
                const color = STATUS_COLOR[a.status];
                const loud = LOUD.includes(a.status);
                const isSel = activeAgentId === a.id;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x} ${n.y})`}
                    className="nx-pop nx-hit"
                    style={{ opacity: op, transition: 'opacity 350ms ease', animationDelay: delay }}
                    onPointerEnter={() => setHoverAgent(a.id)}
                    onPointerLeave={() => setHoverAgent(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (wasDrag.current) return;
                      selectAgent(a.id);
                    }}
                    role="button"
                    aria-label={`${a.name}: ${STATUS_LABEL[a.status]}`}
                  >
                    {loud && <circle r={11} fill={color} opacity={0.18} className="nx-halo" />}
                    {(isSel || hoverAgent === a.id) && (
                      <circle r={10} fill="none" stroke="#fff" strokeOpacity={0.7} vectorEffect="non-scaling-stroke" />
                    )}
                    <circle r={a.status === 'idle' ? 5 : 5.6} fill={color} />
                    <circle r={16} fill="transparent" />
                  </g>
                );
              }

              // leaf / capability
              const hollow = n.id.endsWith(':3') || n.id.endsWith(':2');
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x} ${n.y})`}
                  className="nx-pop nx-hit"
                  style={{ opacity: op, transition: 'opacity 350ms ease', animationDelay: delay }}
                  onPointerEnter={() => setHoverAgent(n.agentId!)}
                  onPointerLeave={() => setHoverAgent(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (wasDrag.current) return;
                    selectAgent(n.agentId!);
                  }}
                >
                  {hollow ? (
                    <>
                      <circle r={3.6} fill="#0b0e15" stroke="rgba(226,232,240,0.55)" strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
                      <circle r={1.1} fill="rgba(226,232,240,0.5)" />
                    </>
                  ) : (
                    <circle r={3.3} fill="#e2e8f0" opacity={0.9} className="nx-twinkle" style={{ animationDelay: `${(i % 9) * 0.7}s` }} />
                  )}
                  <circle r={10} fill="transparent" />
                </g>
              );
            })}

            {/* ---- node labels (collision-free) ---- */}
            <g pointerEvents="none">
              {labels.map((l) => (
                <text
                  key={l.key}
                  x={l.x}
                  y={l.y}
                  textAnchor={l.anchor}
                  dominantBaseline="middle"
                  fontSize={l.size}
                  fill={l.color}
                  className={l.kind === 'agent' ? 'nx-label nx-label-agent' : 'nx-label'}
                >
                  {l.text}
                </text>
              ))}
            </g>

            {/* ---- department labels ---- */}
            {vis.labels.map((l) => {
              const dept = deptById[l.deptId];
              const op = focusDept && focusDept !== l.deptId ? 0.3 : 1;
              const big = deptPx / K;
              return (
                <g
                  key={l.deptId}
                  className="nx-hit nx-fade"
                  style={{ opacity: op, transition: 'opacity 350ms ease', animationDelay: '0.9s' }}
                  onPointerEnter={() => setHoverDept(l.deptId)}
                  onPointerLeave={() => setHoverDept(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectDepartment(activeDepartmentId === l.deptId ? null : l.deptId);
                  }}
                >
                  <g style={{ transform: `translate(${l.x}px, ${l.y}px)`, transition: 'transform 800ms cubic-bezier(.22,.8,.18,1)' }}>
                    <text x={0} y={0} textAnchor={l.anchor} fontSize={big} letterSpacing={deptSpacing / K} className="nx-dept-label">
                      <title>{dept.name}</title>
                      {DEPT_SHORT[l.deptId]}
                    </text>
                    {!compact && (
                      <text x={0} y={17 / K} textAnchor={l.anchor} fontSize={9.5 / K} className="nx-dept-tags">
                        {DEPT_TAGS[l.deptId]}
                      </text>
                    )}
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* ---- hover card ---- */}
        {cardAgent && (
          <div
            className="nx-card pointer-events-none absolute z-20 hidden sm:block right-5 bottom-20"
            style={{ marginRight: panelW }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[cardAgent.status] }} />
              <span className="text-[13px] font-semibold text-white">{cardAgent.name}</span>
            </div>
            <div className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              {cardAgent.departmentName} · {STATUS_LABEL[cardAgent.status]}
            </div>
            <p className="text-[12px] leading-snug text-slate-300 line-clamp-3">
              {cardAgent.currentTask || cardAgent.subtitle}
            </p>
            <div className="mt-2 text-[10.5px] font-mono text-slate-500">
              {cardAgent.capabilities.length} skills · click to open
            </div>
          </div>
        )}

        {/* ---- department switcher (like the reference's bottom carousel) ---- */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:gap-8 z-10"
          style={{ marginLeft: -panelW / 2 }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button className="nx-arrow" onClick={() => cycle(-1)} aria-label="Previous department">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center min-w-[200px] sm:min-w-[280px]">
            <div className="nx-switch-title">{shownDept ? shownDept.name.toUpperCase() : 'ALL DEPARTMENTS'}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-1 truncate">
              {shownDept ? DEPT_TAGS[shownDept.id] : 'hover a branch · click to focus · ← → to browse'}
            </div>
          </div>
          <button className="nx-arrow" onClick={() => cycle(1)} aria-label="Next department">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
