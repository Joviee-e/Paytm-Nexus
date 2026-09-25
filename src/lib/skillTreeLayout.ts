// Paytm Nexus — computed radial "skill tree" layout.
// Every position is derived from the data (no hand-placed coordinates), then a
// small relaxation pass pushes apart anything that ends up too close. Adding or
// removing agents / capabilities re-flows the tree automatically.

import type { Agent, Department, DepartmentId } from '../types/nexus';

export type NodeKind = 'dept' | 'joint' | 'agent' | 'leaf';

export interface LNode {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  deptId: DepartmentId;
  agentId?: string;
  label?: string;
  /** polar angle (radians) of the node around the core */
  angle: number;
}

export interface LEdge {
  id: string;
  from: string;
  to: string;
  deptId: DepartmentId;
  agentId?: string;
  kind: 'trunk' | 'branch' | 'twig';
}

export interface DeptLabel {
  deptId: DepartmentId;
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
}

export interface SkillTreeLayout {
  nodes: LNode[];
  edges: LEdge[];
  byId: Record<string, LNode>;
  labels: DeptLabel[];
  /** world-space half extents of the nodes (labels are sized in screen px) */
  nodeExtentX: number;
  nodeExtentY: number;
}

// Where each department sits around the core (degrees, 0 = right, clockwise).
// Top and bottom are left open for the header and the department switcher.
export const DEPT_ANGLES: Record<DepartmentId, number> = {
  'customer-success': -120,
  'payment-ops': -60,
  'finance-recon': 0,
  'intelligence-lab': 60,
  'business-ops': 120,
  'merchant-growth': 180,
};

export const DEPT_ORDER: DepartmentId[] = [
  'customer-success',
  'payment-ops',
  'finance-recon',
  'intelligence-lab',
  'business-ops',
  'merchant-growth',
];

export const R_HUB = 190;
const R_JOINT = 236;
const R_AGENT_A = 306;
const R_AGENT_B = 352;
const SECTOR_HALF = (27 * Math.PI) / 180; // keeps each department inside its slice

const rad = (d: number) => (d * Math.PI) / 180;

// deterministic pseudo-random from a string, so the tree looks organic but
// never jumps between renders
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const angleDiff = (a: number, b: number) => {
  let d = a - b;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
};

export function buildSkillTree(
  departments: Department[],
  agents: Record<string, Agent>
): SkillTreeLayout {
  const nodes: LNode[] = [];
  const edges: LEdge[] = [];

  departments.forEach((dept) => {
    const a0 = rad(DEPT_ANGLES[dept.id] ?? 0);
    const hub: LNode = {
      id: `dept:${dept.id}`,
      kind: 'dept',
      x: Math.cos(a0) * R_HUB,
      y: Math.sin(a0) * R_HUB,
      deptId: dept.id,
      label: dept.name,
      angle: a0,
    };
    nodes.push(hub);
    edges.push({ id: `core-${dept.id}`, from: 'core', to: hub.id, deptId: dept.id, kind: 'trunk' });

    const ids = dept.agentIds.filter((id) => agents[id]);
    const n = ids.length;
    const spread = Math.min(rad(46), rad(9.5) * Math.max(n - 1, 1));

    ids.forEach((agentId, i) => {
      const agent = agents[agentId];
      const t = n === 1 ? 0 : i / (n - 1) - 0.5;
      const aa = a0 + t * spread;
      const r = i % 2 === 0 ? R_AGENT_A : R_AGENT_B;
      const j = hash(agentId);

      const joint: LNode = {
        id: `joint:${agentId}`,
        kind: 'joint',
        x: Math.cos(a0 + t * spread * 0.45) * (R_JOINT + j * 10),
        y: Math.sin(a0 + t * spread * 0.45) * (R_JOINT + j * 10),
        deptId: dept.id,
        agentId,
        angle: aa,
      };
      const node: LNode = {
        id: `agent:${agentId}`,
        kind: 'agent',
        x: Math.cos(aa) * r,
        y: Math.sin(aa) * r,
        deptId: dept.id,
        agentId,
        label: agent.name,
        angle: aa,
      };
      nodes.push(joint, node);
      edges.push(
        { id: `${hub.id}>${joint.id}`, from: hub.id, to: joint.id, deptId: dept.id, agentId, kind: 'branch' },
        { id: `${joint.id}>${node.id}`, from: joint.id, to: node.id, deptId: dept.id, agentId, kind: 'branch' }
      );

      // capabilities grow outward as twigs: even ones off the agent,
      // odd ones continue from the previous twig -> natural forking look
      const caps = agent.capabilities.slice(0, 4);
      const leafIds: string[] = [];
      caps.forEach((cap, ci) => {
        const parentId = ci % 2 === 0 ? node.id : leafIds[ci - 1];
        const parent = ci % 2 === 0 ? node : nodes[nodes.length - 1];
        const jj = hash(`${agentId}:${ci}`);
        const side = ci % 4 < 2 ? -1 : 1;
        const dir = aa + side * rad(ci % 2 === 0 ? 7 : 11) + (jj - 0.5) * rad(6);
        const len = 44 + jj * 18;
        const leaf: LNode = {
          id: `leaf:${agentId}:${ci}`,
          kind: 'leaf',
          x: parent.x + Math.cos(dir) * len,
          y: parent.y + Math.sin(dir) * len,
          deptId: dept.id,
          agentId,
          label: cap,
          angle: dir,
        };
        leafIds.push(leaf.id);
        nodes.push(leaf);
        edges.push({ id: `${parentId}>${leaf.id}`, from: parentId, to: leaf.id, deptId: dept.id, agentId, kind: 'twig' });
      });
    });
  });

  relax(nodes);

  const byId: Record<string, LNode> = { core: { id: 'core', kind: 'dept', x: 0, y: 0, deptId: 'intelligence-lab', angle: 0 } };
  nodes.forEach((nd) => (byId[nd.id] = nd));

  // department labels sit just outside the outermost node of their slice
  const labels: DeptLabel[] = departments.map((dept) => {
    const a0 = rad(DEPT_ANGLES[dept.id] ?? 0);
    const maxR = nodes
      .filter((nd) => nd.deptId === dept.id)
      .reduce((m, nd) => Math.max(m, Math.hypot(nd.x, nd.y)), 0);
    const R = maxR + 38;
    const c = Math.cos(a0);
    const anchor: DeptLabel['anchor'] = c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle';
    return { deptId: dept.id, x: c * R, y: Math.sin(a0) * R, anchor };
  });

  let nodeExtentX = 0;
  let nodeExtentY = 0;
  nodes.forEach((nd) => {
    nodeExtentX = Math.max(nodeExtentX, Math.abs(nd.x));
    nodeExtentY = Math.max(nodeExtentY, Math.abs(nd.y));
  });

  return { nodes, edges, byId, labels, nodeExtentX, nodeExtentY };
}

/** Push apart nodes that are too close; keep each department in its slice. */
function relax(nodes: LNode[]) {
  const movable = nodes.filter((n) => n.kind !== 'dept');
  const minDist = (a: LNode, b: LNode) =>
    a.kind === 'agent' || b.kind === 'agent' ? 30 : a.kind === 'joint' || b.kind === 'joint' ? 14 : 24;

  for (let iter = 0; iter < 80; iter++) {
    let moved = false;
    for (let i = 0; i < movable.length; i++) {
      for (let k = i + 1; k < movable.length; k++) {
        const a = movable[i];
        const b = movable[k];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.01;
        const m = minDist(a, b);
        if (d < m) {
          const push = (m - d) / 2;
          const ux = dx / d;
          const uy = dy / d;
          a.x -= ux * push;
          a.y -= uy * push;
          b.x += ux * push;
          b.y += uy * push;
          moved = true;
        }
      }
    }
    // stay inside own sector and outside the hub ring
    movable.forEach((nd) => {
      const center = rad(DEPT_ANGLES[nd.deptId] ?? 0);
      let r = Math.hypot(nd.x, nd.y);
      let ang = Math.atan2(nd.y, nd.x);
      const d = angleDiff(ang, center);
      if (Math.abs(d) > SECTOR_HALF) ang = center + Math.sign(d) * SECTOR_HALF;
      const minR = nd.kind === 'joint' ? R_JOINT - 10 : R_HUB + 60;
      if (r < minR) r = minR;
      nd.x = Math.cos(ang) * r;
      nd.y = Math.sin(ang) * r;
    });
    if (!moved) break;
  }
}

/** Rough text width estimate (world units) for label collision checks. */
export const textWidth = (s: string, size: number, spacing = 0) => s.length * (size * 0.56 + spacing);
