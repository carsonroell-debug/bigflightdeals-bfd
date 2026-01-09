import { useState } from 'react';
import { getLastMission, isLastMissionRecent } from '../utils/missionStore';
import { track } from '../utils/analytics';
import type { MissionV1 } from '../types/mission';
import './ResumeBanner.css';

interface ResumeBannerProps {
  onResumeMission: (mission: MissionV1) => void;
}

// Compute initial mission state (runs once on module load)
const getInitialMission = (): MissionV1 | null => {
  if (isLastMissionRecent(7)) {
    return getLastMission();
  }
  return null;
};

/**
 * ResumeBanner - Subtle banner to resume last mission if < 7 days old.
 * Shown at top of page on initial load.
 */
const ResumeBanner = ({ onResumeMission }: ResumeBannerProps) => {
  // Lazy initial state - only computed once
  const [mission] = useState<MissionV1 | null>(getInitialMission);
  const [dismissed, setDismissed] = useState(false);

  const handleResume = () => {
    if (!mission) return;

    track('mission_resumed', {
      id: mission.id,
      origin: mission.originCode,
      destination: mission.destinationCode,
      source: 'resume_banner',
    });

    onResumeMission(mission);
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (!mission || dismissed) {
    return null;
  }

  return (
    <div className="resume-banner">
      <div className="resume-banner-content">
        <span className="resume-banner-text">
          Resume your last mission:{' '}
          <strong>
            {mission.originCode} → {mission.destinationCode}
          </strong>
          {mission.month && ` in ${mission.month}`}
        </span>
        <div className="resume-banner-actions">
          <button
            className="resume-banner-btn resume"
            onClick={handleResume}
            type="button"
          >
            Resume
          </button>
          <button
            className="resume-banner-btn dismiss"
            onClick={handleDismiss}
            type="button"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeBanner;
