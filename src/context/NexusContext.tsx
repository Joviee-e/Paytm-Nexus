import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { DepartmentId, Department, Agent, Workflow, DemoState } from '../types/nexus';
import { DEPARTMENTS, INITIAL_AGENTS, MULTI_AGENT_WORKFLOW, getAgentsForDemoState } from '../data/nexusData';

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'warning' | 'success' | 'action';
}

interface NexusContextType {
  // Spatial Map State
  departments: Department[];
  agents: Record<string, Agent>;
  activeDepartmentId: DepartmentId | null;
  activeAgentId: string | null;
  activeDepartment: Department | null;
  activeAgent: Agent | null;
  
  // Activation Choreography
  isActivated: boolean;
  activationCount: number;
  triggerActivation: () => void;
  
  // Selection Handlers
  selectDepartment: (id: DepartmentId | null) => void;
  selectAgent: (id: string | null) => void;
  returnToWorkforceMap: () => void;
  
  // Demo States
  demoState: DemoState;
  setDemoState: (state: DemoState) => void;
  
  // Multi-Agent Workflow
  workflow: Workflow;
  isWorkflowOpen: boolean;
  openWorkflow: () => void;
  closeWorkflow: () => void;
  stepWorkflowForward: () => void;
  resetWorkflow: () => void;
  
  // Agent Diagnostics & Action Simulation
  diagnosingAgentIds: Record<string, boolean>;
  agentDiagnosticLogs: Record<string, AgentLogEntry[]>;
  runAgentDiagnosis: (agentId: string) => void;
  approveAgentAction: (agentId: string) => void;
  rejectAgentAction: (agentId: string) => void;
  
  // Notifications / Feedback
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' } | null;
  dismissToast: () => void;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

export const NexusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [departments] = useState<Department[]>(DEPARTMENTS);
  const [demoState, setDemoStateInternal] = useState<DemoState>('calm');
  const [agents, setAgents] = useState<Record<string, Agent>>(() => getAgentsForDemoState('calm'));
  
  const [activeDepartmentId, setActiveDepartmentId] = useState<DepartmentId | null>(null);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  
  const [isActivated, setIsActivated] = useState<boolean>(true);
  const [activationCount, setActivationCount] = useState<number>(1);
  
  const [workflow, setWorkflow] = useState<Workflow>(MULTI_AGENT_WORKFLOW);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState<boolean>(false);
  
  const [diagnosingAgentIds, setDiagnosingAgentIds] = useState<Record<string, boolean>>({});
  const [agentDiagnosticLogs, setAgentDiagnosticLogs] = useState<Record<string, AgentLogEntry[]>>({});
  
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToastMessage({ text, type });
    const timer = setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Update agents when demo state changes
  const setDemoState = useCallback((state: DemoState) => {
    setDemoStateInternal(state);
    const updated = getAgentsForDemoState(state);
    setAgents(updated);

    // If switching to workflow demo, also open the workflow view
    if (state === 'multi_agent_workflow') {
      setIsWorkflowOpen(true);
      showToast('Multi-Agent Collaborative Workflow Activated: Revenue Decline Investigation', 'info');
    } else if (state === 'payment_issue') {
      showToast('Simulated State: Payment Sentinel flagged elevated failure rates', 'warning');
    } else if (state === 'revenue_risk') {
      showToast('Simulated State: Revenue Forecaster detected downward 14-day trajectory', 'warning');
    } else if (state === 'customer_risk') {
      showToast('Simulated State: Churn Predictor isolated 1,420 at-risk customers', 'warning');
    } else if (state === 'approval_required') {
      showToast('Simulated State: Campaign Strategist awaiting merchant approval', 'info');
    } else if (state === 'calm') {
      showToast('Simulated State: Workforce returned to calm idle baseline', 'info');
    }
  }, [showToast]);

  const selectDepartment = useCallback((id: DepartmentId | null) => {
    setActiveDepartmentId(id);
    setActiveAgentId(null);
  }, []);

  const selectAgent = useCallback((id: string | null) => {
    setActiveAgentId(id);
    if (id && agents[id]) {
      setActiveDepartmentId(agents[id].departmentId);
    }
  }, [agents]);

  const returnToWorkforceMap = useCallback(() => {
    setActiveAgentId(null);
    setActiveDepartmentId(null);
    setIsWorkflowOpen(false);
  }, []);

  const triggerActivation = useCallback(() => {
    setIsActivated(false);
    setActivationCount((prev) => prev + 1);
    showToast('Activating Paytm Nexus Core Intelligence...', 'info');
    setTimeout(() => {
      setIsActivated(true);
    }, 150);
  }, [showToast]);

  const openWorkflow = useCallback(() => {
    setIsWorkflowOpen(true);
  }, []);

  const closeWorkflow = useCallback(() => {
    setIsWorkflowOpen(false);
  }, []);

  const stepWorkflowForward = useCallback(() => {
    setWorkflow((prev) => {
      const nextIndex = Math.min(prev.currentStepIndex + 1, prev.steps.length - 1);
      const updatedSteps = prev.steps.map((step, idx) => {
        if (idx < nextIndex) return { ...step, status: 'completed' as const };
        if (idx === nextIndex) return { ...step, status: 'active' as const };
        return { ...step, status: 'waiting' as const };
      });
      return {
        ...prev,
        currentStepIndex: nextIndex,
        steps: updatedSteps,
      };
    });
    showToast('Advanced workflow to next AI workforce step', 'info');
  }, [showToast]);

  const resetWorkflow = useCallback(() => {
    setWorkflow(MULTI_AGENT_WORKFLOW);
    showToast('Reset workflow to step 1', 'info');
  }, [showToast]);

  // Run real-time diagnosis simulation for an agent
  const runAgentDiagnosis = useCallback((agentId: string) => {
    setDiagnosingAgentIds((prev) => ({ ...prev, [agentId]: true }));
    showToast(`Running diagnostic audit for ${agents[agentId]?.name || agentId}...`, 'info');

    // Add streaming logs sequentially
    const initialLog: AgentLogEntry = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      text: `Initialized diagnostic telemetry run for ${agentId}. Checking RPC endpoints and baseline models...`,
      type: 'info',
    };

    setAgentDiagnosticLogs((prev) => ({
      ...prev,
      [agentId]: [initialLog],
    }));

    setTimeout(() => {
      const log2: AgentLogEntry = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        text: 'Evaluating 10,000 recent transactions against 30-day Bayesian moving baseline. Cross-referencing gateway response codes.',
        type: 'info',
      };
      setAgentDiagnosticLogs((prev) => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), log2],
      }));
    }, 1000);

    setTimeout(() => {
      const log3: AgentLogEntry = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        text: 'Diagnostic finding confirmed: Gateway latency standard deviation 4.2x above nominal. Mitigation route available.',
        type: 'warning',
      };
      setAgentDiagnosticLogs((prev) => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), log3],
      }));
      setDiagnosingAgentIds((prev) => ({ ...prev, [agentId]: false }));
      showToast(`Diagnosis completed for ${agents[agentId]?.name || agentId}`, 'success');
    }, 2200);
  }, [agents, showToast]);

  // Human approval of agent's recommendation
  const approveAgentAction = useCallback((agentId: string) => {
    setAgents((prev) => {
      if (!prev[agentId]) return prev;
      return {
        ...prev,
        [agentId]: {
          ...prev[agentId],
          status: 'completed',
          requiresHumanAction: false,
          currentTask: 'Action authorized by merchant. Execution completed successfully.',
        },
      };
    });
    showToast(`Merchant approved recommendation from ${agents[agentId]?.name || agentId}. Action executed!`, 'success');
  }, [agents, showToast]);

  const rejectAgentAction = useCallback((agentId: string) => {
    setAgents((prev) => {
      if (!prev[agentId]) return prev;
      return {
        ...prev,
        [agentId]: {
          ...prev[agentId],
          status: 'idle',
          requiresHumanAction: false,
          currentTask: 'Recommendation dismissed by merchant. Reverted to continuous monitoring.',
        },
      };
    });
    showToast(`Recommendation dismissed for ${agents[agentId]?.name || agentId}`, 'info');
  }, [agents, showToast]);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        returnToWorkforceMap();
      } else if (e.key === '1') {
        setDemoState('calm');
      } else if (e.key === '2') {
        setDemoState('payment_issue');
      } else if (e.key === '3') {
        setDemoState('revenue_risk');
      } else if (e.key === '4') {
        setDemoState('customer_risk');
      } else if (e.key === '5') {
        setDemoState('approval_required');
      } else if (e.key === '6') {
        setDemoState('multi_agent_workflow');
      } else if (e.key === 'w' || e.key === 'W') {
        setIsWorkflowOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [returnToWorkforceMap, setDemoState]);

  const activeDepartment = activeDepartmentId
    ? departments.find((d) => d.id === activeDepartmentId) || null
    : null;

  const activeAgent = activeAgentId ? agents[activeAgentId] || null : null;

  return (
    <NexusContext.Provider
      value={{
        departments,
        agents,
        activeDepartmentId,
        activeAgentId,
        activeDepartment,
        activeAgent,
        isActivated,
        activationCount,
        triggerActivation,
        selectDepartment,
        selectAgent,
        returnToWorkforceMap,
        demoState,
        setDemoState,
        workflow,
        isWorkflowOpen,
        openWorkflow,
        closeWorkflow,
        stepWorkflowForward,
        resetWorkflow,
        diagnosingAgentIds,
        agentDiagnosticLogs,
        runAgentDiagnosis,
        approveAgentAction,
        rejectAgentAction,
        toastMessage,
        dismissToast,
      }}
    >
      {children}
    </NexusContext.Provider>
  );
};

export const useNexus = (): NexusContextType => {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error('useNexus must be used within a NexusProvider');
  }
  return context;
};
