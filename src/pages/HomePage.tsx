/**
 * HomePage
 *
 * Main landing page content. Extracted for routing purposes.
 */

import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import MissionInputSection from '../components/MissionInputSection';
import SavedMissionsPanel from '../components/SavedMissionsPanel';
import FlightWidget from '../components/FlightWidget';
import AboutSection from '../components/AboutSection';
import FAQSection from '../components/FAQSection';
import ResumeBanner from '../components/ResumeBanner';
import type { MissionV1 } from '../types/mission';

interface HomePageProps {
  onRunMission: (mission: MissionV1) => void;
  onResumeMission: (mission: MissionV1) => void;
  onEditMission: (mission: MissionV1) => void;
}

const HomePage = ({ onRunMission, onResumeMission, onEditMission }: HomePageProps) => {
  return (
    <>
      <ResumeBanner onResumeMission={onResumeMission} />
      <main>
        <Hero />
        <HowItWorks />
        <MissionInputSection onRunMission={onRunMission} />
        <SavedMissionsPanel
          onRunMission={onResumeMission}
          onEditMission={onEditMission}
        />
        <FlightWidget />
        <AboutSection />
        <FAQSection />
      </main>
    </>
  );
};

export default HomePage;
