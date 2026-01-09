import { useEffect, useReducer, useState } from 'react';
import WidgetEmbed from './WidgetEmbed';
import { track } from '../utils/analytics';
import { saveMission, getSavedMissions, canSaveMission, MAX_SAVED_MISSIONS } from '../utils/missionStore';
import type { MissionV1 } from '../types/mission';
import './MissionModal.css';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: MissionV1 | null;
  onRefineMission?: (refinedMission: MissionV1) => void;
}

/**
 * MissionModal - Agentic flight search modal.
 *
 * Opens when user clicks "Run this mission" on a deal card.
 * Shows the route and embeds the Aviasales widget for instant price scanning.
 *
 * Accepts a Mission object that can be triggered by:
 * - UI components (human clicks)
 * - AI agents (JSON payloads)
 * - External systems (API calls)
 */
const MissionModal = ({ isOpen, onClose, mission, onRefineMission }: MissionModalProps) => {
  // Force re-render after save to update isSaved
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const [showProMessage, setShowProMessage] = useState(false);

  // Compute if saved on each render
  const isSaved = mission ? getSavedMissions().some((m) => m.id === mission.id) : false;

  const handleSaveMission = () => {
    if (!mission) return;

    // Check soft limit
    if (!canSaveMission() && !isSaved) {
      setShowProMessage(true);
      track('pro_limit_reached', {
        type: 'saved_missions',
        limit: MAX_SAVED_MISSIONS,
      });
      return;
    }

    saveMission(mission);
    forceUpdate();
    setShowProMessage(false);

    track('mission_saved', {
      id: mission.id,
      origin: mission.originCode,
      destination: mission.destinationCode,
    });
  };

  // Refine mission helpers
  const handleRefine = (refinementType: 'cheaper' | 'shorter' | 'different_dest') => {
    if (!mission || !onRefineMission) return;

    let refinedMission: MissionV1;
    const newId = `${mission.id}-${refinementType}-${Date.now()}`;

    switch (refinementType) {
      case 'cheaper':
        refinedMission = {
          ...mission,
          id: newId,
          budget: mission.budget ? Math.round(mission.budget * 0.8) : 500,
          tags: [...(mission.tags || []), 'budget', 'cheap'].filter((v, i, a) => a.indexOf(v) === i),
          source: 'mission_input',
          createdAt: new Date().toISOString(),
        };
        break;
      case 'shorter':
        refinedMission = {
          ...mission,
          id: newId,
          tripLengthDays: mission.tripLengthDays ? Math.max(3, mission.tripLengthDays - 3) : 5,
          tags: [...(mission.tags || []), 'weekend'].filter((v, i, a) => a.indexOf(v) === i),
          source: 'mission_input',
          createdAt: new Date().toISOString(),
        };
        break;
      case 'different_dest': {
        // Pick a different destination from same region
        const altDestinations: Record<string, { code: string; label: string }[]> = {
          LIS: [{ code: 'OPO', label: 'Porto (OPO)' }, { code: 'MAD', label: 'Madrid (MAD)' }],
          BCN: [{ code: 'MAD', label: 'Madrid (MAD)' }, { code: 'LIS', label: 'Lisbon (LIS)' }],
          MAD: [{ code: 'BCN', label: 'Barcelona (BCN)' }, { code: 'LIS', label: 'Lisbon (LIS)' }],
          OPO: [{ code: 'LIS', label: 'Lisbon (LIS)' }, { code: 'MAD', label: 'Madrid (MAD)' }],
          BKK: [{ code: 'SGN', label: 'Ho Chi Minh City (SGN)' }],
          SGN: [{ code: 'BKK', label: 'Bangkok (BKK)' }],
          MEX: [{ code: 'LIS', label: 'Lisbon (LIS)' }],
          TFS: [{ code: 'LIS', label: 'Lisbon (LIS)' }],
        };
        const alts = altDestinations[mission.destinationCode] || [{ code: 'LIS', label: 'Lisbon (LIS)' }];
        const alt = alts[0];
        refinedMission = {
          ...mission,
          id: newId,
          destinationCode: alt.code,
          destinationLabel: alt.label,
          source: 'mission_input',
          createdAt: new Date().toISOString(),
        };
        break;
      }
    }

    // Auto-save refined mission if possible
    if (canSaveMission()) {
      saveMission(refinedMission);
    }

    track('mission_refined', {
      originalId: mission.id,
      refinedId: refinedMission.id,
      refinementType,
      origin: mission.originCode,
      destination: refinedMission.destinationCode,
    });

    onRefineMission(refinedMission);
  };
  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Track modal open
  useEffect(() => {
    if (isOpen && mission) {
      track('mission_modal_opened', {
        origin: mission.originCode,
        destination: mission.destinationCode,
      });
    }
  }, [isOpen, mission]);

  if (!isOpen) return null;

  return (
    <div className="mission-modal-overlay" onClick={onClose}>
      <div 
        className="mission-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="mission-modal-close"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          ×
        </button>

        <div className="mission-modal-header">
          <h2 className="mission-modal-title">Mission Ready</h2>
          <p className="mission-modal-subtitle">Route locked. Scan live prices instantly.</p>
        </div>

        {mission && (
          <div className="mission-modal-route">
            <div className="mission-route-display">
              <span className="mission-route-city">
                {mission.originLabel}
              </span>
              <span className="mission-route-arrow">→</span>
              <span className="mission-route-city">
                {mission.destinationLabel}
              </span>
            </div>
            <div className="mission-route-codes">
              {mission.originCode} → {mission.destinationCode}
            </div>
            {mission.budget && mission.currency && (
              <div className="mission-budget">
                Budget: {mission.currency} {mission.budget}
              </div>
            )}
            {mission.notes && (
              <div className="mission-notes">
                {mission.notes}
              </div>
            )}
          </div>
        )}

        <div className="mission-modal-widget">
          {mission ? (
            <WidgetEmbed 
              originCode={mission.originCode}
              destinationCode={mission.destinationCode}
              className="mission-widget-embed"
            />
          ) : (
            <WidgetEmbed className="mission-widget-embed" />
          )}
        </div>

        {onRefineMission && (
          <div className="mission-refine-section">
            <p className="mission-refine-label">Refine this mission:</p>
            <div className="mission-refine-buttons">
              <button
                className="mission-refine-btn"
                onClick={() => handleRefine('cheaper')}
                type="button"
              >
                Cheaper
              </button>
              <button
                className="mission-refine-btn"
                onClick={() => handleRefine('shorter')}
                type="button"
              >
                Shorter trip
              </button>
              <button
                className="mission-refine-btn"
                onClick={() => handleRefine('different_dest')}
                type="button"
              >
                Different destination
              </button>
            </div>
          </div>
        )}

        {showProMessage && (
          <div className="mission-pro-message">
            <p>You've reached the limit of {MAX_SAVED_MISSIONS} saved missions.</p>
            <p className="mission-pro-teaser">Pro Missions coming soon — unlimited saves, alerts & more.</p>
          </div>
        )}

        <div className="mission-modal-actions">
          <button
            className="mission-button-primary"
            onClick={() => {
              // Widget is already loaded and ready - user can interact with it
              // This button provides clear CTA but widget handles the actual search
              // Focus the widget container to draw attention
              const widgetContainer = document.querySelector('.mission-widget-embed');
              if (widgetContainer) {
                widgetContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            type="button"
          >
            Search live prices
          </button>
          <button
            className={`mission-button-save ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveMission}
            disabled={isSaved}
            type="button"
          >
            {isSaved ? 'Mission saved' : 'Save mission'}
          </button>
          <button
            className="mission-button-secondary"
            onClick={onClose}
            type="button"
          >
            Change mission
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionModal;
