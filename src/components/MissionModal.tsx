import { useEffect, useReducer } from 'react';
import WidgetEmbed from './WidgetEmbed';
import { track } from '../utils/analytics';
import { saveMission, getSavedMissions } from '../utils/missionStore';
import type { MissionV1 } from '../types/mission';
import './MissionModal.css';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: MissionV1 | null;
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
const MissionModal = ({ isOpen, onClose, mission }: MissionModalProps) => {
  // Force re-render after save to update isSaved
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  // Compute if saved on each render
  const isSaved = mission ? getSavedMissions().some((m) => m.id === mission.id) : false;

  const handleSaveMission = () => {
    if (!mission) return;

    saveMission(mission);
    forceUpdate();

    track('mission_saved', {
      id: mission.id,
      origin: mission.originCode,
      destination: mission.destinationCode,
    });
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
