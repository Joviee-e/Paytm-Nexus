// Paytm Nexus - Spatial Intelligence Workforce Types

export type DepartmentId =
  | 'payment-ops'
  | 'finance-recon'
  | 'merchant-growth'
  | 'customer-success'
  | 'business-ops'
  | 'intelligence-lab';

export type AgentStatus =
  | 'idle'
  | 'working'
  | 'attention'
  | 'critical'
  | 'awaiting_approval'
  | 'completed'
  | 'failed';

export interface AgentMetric {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export interface AgentIntelligence {
  model: string;
  confidence: number;
  benchmarkComparison?: string;
  metrics: AgentMetric[];
}

export interface RecommendedAction {
  title: string;
  description: string;
  impact: string;
  type: 'approval' | 'investigation' | 'configuration' | 'escalation';
}

export interface Agent {
  id: string;
  name: string;
  departmentId: DepartmentId;
  departmentName: string;
  subtitle: string;
  description: string;
  status: AgentStatus;
  capabilities: string[];
  currentTask?: string;
  lastRun?: string;
  requiresHumanAction?: boolean;
  alertSignal?: string;
  evidence?: string[];
  dataSources: string[];
  intelligence?: AgentIntelligence;
  recommendedAction?: RecommendedAction;
  availableActions: string[];
  iconName: string;
}

export interface Department {
  id: DepartmentId;
  name: string;
  shortDescription: string;
  description: string;
  iconName: string;
  agentIds: string[];
  accentColor: string;
  ambientColor: string;
}

export interface WorkflowStep {
  stepNumber: number;
  agentId: string;
  agentName: string;
  departmentId: DepartmentId;
  role: string;
  task: string;
  output: string;
  status: 'completed' | 'active' | 'waiting' | 'failed' | 'approval_required';
  metric?: string;
  confidence?: number;
  timestamp?: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  trigger: string;
  status: 'running' | 'completed' | 'paused' | 'awaiting_approval';
  currentStepIndex: number;
  steps: WorkflowStep[];
}

export type DemoState =
  | 'calm'
  | 'payment_issue'
  | 'revenue_risk'
  | 'customer_risk'
  | 'approval_required'
  | 'multi_agent_workflow';
