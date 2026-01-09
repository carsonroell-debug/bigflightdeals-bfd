import { useState, useReducer } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ToolsSection from './components/ToolsSection';
import MissionInputSection from './components/MissionInputSection';
import FlightDealsSection from './components/FlightDealsSection';
import FlightWidget from './components/FlightWidget';
import PlannerSection from './components/PlannerSection';
import AboutSection from './components/AboutSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import MissionModal from './components/MissionModal';
import ResumeBanner from './components/ResumeBanner';
import SavedMissionsPanel from './components/SavedMissionsPanel';
import { executeMission } from './utils/executeMission';
import type { MissionV1 } from './types/mission';
import './App.css';

function App() {
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<MissionV1 | null>(null);
  // Force re-render when saved missions change
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const handleOpenMission = (mission: MissionV1) => {
    setSelectedMission(mission);
    setIsMissionModalOpen(true);
  };

  const handleCloseMission = () => {
    setIsMissionModalOpen(false);
    // Force re-render to update SavedMissionsPanel
    forceUpdate();
  };

  const handleResumeMission = (mission: MissionV1) => {
    // Execute mission to update lastMission timestamp
    const result = executeMission(mission, { openModal: true });
    setSelectedMission(result.mission);
    setIsMissionModalOpen(true);
  };

  const handleEditMission = (mission: MissionV1) => {
    // For v1.5, edit just opens modal with mission loaded
    // User can use refine buttons to modify
    setSelectedMission(mission);
    setIsMissionModalOpen(true);
  };

  const handleRefineMission = (refinedMission: MissionV1) => {
    // Execute refined mission and update modal
    const result = executeMission(refinedMission, { openModal: true });
    setSelectedMission(result.mission);
    // Modal stays open with new mission
  };

  return (
    <div className="app">
      <ResumeBanner onResumeMission={handleResumeMission} />
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <ToolsSection />
        <MissionInputSection onRunMission={handleOpenMission} />
        <SavedMissionsPanel
          onRunMission={handleResumeMission}
          onEditMission={handleEditMission}
        />
        <FlightDealsSection onRunMission={handleOpenMission} />
        <FlightWidget />
        <PlannerSection />
        <AboutSection />
        <FAQSection />
      </main>
      <Footer />
      <MissionModal
        isOpen={isMissionModalOpen}
        onClose={handleCloseMission}
        mission={selectedMission}
        onRefineMission={handleRefineMission}
      />
    </div>
  );
}

export default App;
