import { useReducer } from 'react';
import { getSavedMissions, removeSavedMission } from '../utils/missionStore';
import { track } from '../utils/analytics';
import type { MissionV1 } from '../types/mission';
import './SavedMissionsPanel.css';

interface SavedMissionsPanelProps {
  onRunMission: (mission: MissionV1) => void;
  onEditMission: (mission: MissionV1) => void;
}

/**
 * SavedMissionsPanel - Shows user's saved missions with run/edit/delete actions.
 * Displays last 3 saved missions.
 */
const SavedMissionsPanel = ({ onRunMission, onEditMission }: SavedMissionsPanelProps) => {
  // Force re-render after delete
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const savedMissions = getSavedMissions().slice(-3).reverse(); // Last 3, newest first

  const handleDelete = (mission: MissionV1) => {
    removeSavedMission(mission.id);
    forceUpdate();

    track('mission_deleted', {
      id: mission.id,
      origin: mission.originCode,
      destination: mission.destinationCode,
    });
  };

  const handleRun = (mission: MissionV1) => {
    track('mission_resumed', {
      id: mission.id,
      origin: mission.originCode,
      destination: mission.destinationCode,
      source: 'saved_panel',
    });
    onRunMission(mission);
  };

  if (savedMissions.length === 0) {
    return null;
  }

  return (
    <section className="saved-missions-panel">
      <div className="saved-missions-container">
        <h3 className="saved-missions-title">Your Saved Missions</h3>
        <div className="saved-missions-list">
          {savedMissions.map((mission) => (
            <div key={mission.id} className="saved-mission-card">
              <div className="saved-mission-route">
                <span className="saved-mission-origin">{mission.originCode}</span>
                <span className="saved-mission-arrow">→</span>
                <span className="saved-mission-dest">{mission.destinationCode}</span>
              </div>
              <div className="saved-mission-meta">
                {mission.month && (
                  <span className="saved-mission-tag">{mission.month}</span>
                )}
                {mission.budget && mission.currency && (
                  <span className="saved-mission-tag">
                    {mission.currency} {mission.budget}
                  </span>
                )}
                {mission.tags?.slice(0, 2).map((tag) => (
                  <span key={tag} className="saved-mission-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="saved-mission-actions">
                <button
                  className="saved-mission-btn run"
                  onClick={() => handleRun(mission)}
                  type="button"
                >
                  Run
                </button>
                <button
                  className="saved-mission-btn edit"
                  onClick={() => onEditMission(mission)}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="saved-mission-btn delete"
                  onClick={() => handleDelete(mission)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SavedMissionsPanel;
