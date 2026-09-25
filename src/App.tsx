import React from 'react';
import { NexusProvider } from './context/NexusContext';
import { SkillTreeMap } from './components/skilltree/SkillTreeMap';
import { AgentWorkspace } from './components/spatial/AgentWorkspace';
import { WorkflowModal } from './components/spatial/WorkflowModal';
import { DemoDock } from './components/spatial/DemoDock';
import { Toast } from './components/spatial/Toast';

const NexusSpatialApp: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070A12] text-slate-100 font-sans select-none">
      {/* Primary view: the SkillTree-style workforce map */}
      <SkillTreeMap />

      {/* Focused Agent Workspace Overlay (when an agent node is clicked) */}
      <AgentWorkspace />

      {/* Multi-Agent Collaborative Workflow Timeline (State 6 or manual trigger) */}
      <WorkflowModal />

      {/* Interactive Simulation & Scenario Demo Dock */}
      <DemoDock />

      {/* Action and feedback notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <NexusProvider>
      <NexusSpatialApp />
    </NexusProvider>
  );
}
