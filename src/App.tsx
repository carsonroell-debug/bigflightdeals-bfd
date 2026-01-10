import { useState, useReducer } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MissionModal from './components/MissionModal';
import HomePage from './pages/HomePage';
import DestinationsIndex from './pages/DestinationsIndex';
import DestinationPage from './pages/DestinationPage';
import RoutesIndex from './pages/RoutesIndex';
import RoutePage from './pages/RoutePage';
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
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onRunMission={handleOpenMission}
                onResumeMission={handleResumeMission}
                onEditMission={handleEditMission}
              />
            }
          />
          <Route path="/destinations" element={<DestinationsIndex />} />
          <Route
            path="/destinations/:slug"
            element={<DestinationPage onRunMission={handleOpenMission} />}
          />
          <Route path="/routes" element={<RoutesIndex />} />
          <Route
            path="/routes/:slug"
            element={<RoutePage onRunMission={handleOpenMission} />}
          />
        </Routes>
        <Footer />
        <MissionModal
          isOpen={isMissionModalOpen}
          onClose={handleCloseMission}
          mission={selectedMission}
          onRefineMission={handleRefineMission}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
