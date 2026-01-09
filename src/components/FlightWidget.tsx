import { useEffect, useState } from 'react';
import { getMission, clearMission } from '../utils/missionStore';
import type { MissionInput } from '../types/mission';
import WidgetEmbed from './WidgetEmbed';
import './FlightWidget.css';

/**
 * FlightWidget - Renders the Travelpayouts/Aviasales flight search widget.
 * 
 * Full-page widget section (kept for SEO, long sessions, and fallback).
 * Uses shared WidgetEmbed component for consistent widget injection.
 * Reads mission from missionStore (localStorage).
 * 
 * Future: This component will be refactored to display API-driven flight results
 * instead of the embedded widget, making it easy to swap implementations.
 */
const FlightWidget = () => {
  // Initialize state from missionStore on mount
  const [mission, setMissionState] = useState<MissionInput | null>(() => 
    getMission()
  );

  useEffect(() => {
    // Listen for mission changes from other components
    const handleMissionExecuted = (event: Event) => {
      const customEvent = event as CustomEvent<MissionInput>;
      setMissionState(customEvent.detail);
    };

    window.addEventListener('bfd-mission-executed', handleMissionExecuted);

    return () => {
      window.removeEventListener('bfd-mission-executed', handleMissionExecuted);
    };
  }, []);

  const handleClearMission = () => {
    clearMission();
    setMissionState(null);
  };

  return (
    <section id="flight-widget" className="flight-widget-section">
      <div className="flight-widget-container">
        <h2 className="section-title">Search flights with BigFlightDeals tools</h2>
        <p className="section-subtitle">
          Book your flights through our search tool below. Your bookings support the site via affiliate partnerships, 
          helping us keep the deals flowing and the content free.
        </p>
        {mission && (
          <div className="selected-route-indicator">
            <span className="selected-route-text">
              Selected route: {mission.originLabel} → {mission.destinationLabel}
            </span>
            <button 
              className="selected-route-change"
              onClick={handleClearMission}
              type="button"
            >
              (change)
            </button>
          </div>
        )}
        <WidgetEmbed
          originCode={mission?.originCode}
          destinationCode={mission?.destinationCode}
          className="flight-widget-container-inner"
        />
      </div>
    </section>
  );
};

export default FlightWidget;
