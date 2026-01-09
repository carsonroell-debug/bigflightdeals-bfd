import { useState } from 'react';
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
import type { MissionInput } from './types/mission';
import './App.css';

function App() {
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<MissionInput | null>(null);

  const handleOpenMission = (mission: MissionInput) => {
    setSelectedMission(mission);
    setIsMissionModalOpen(true);
  };

  const handleCloseMission = () => {
    setIsMissionModalOpen(false);
    // Keep mission in state for potential reuse, but modal is closed
  };

  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <ToolsSection />
        <MissionInputSection onRunMission={handleOpenMission} />
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
      />
    </div>
  );
}

export default App;
