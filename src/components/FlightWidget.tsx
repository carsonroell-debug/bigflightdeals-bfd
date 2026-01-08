import { useEffect, useState } from 'react';
import { getSelectedRoute, clearSelectedRoute } from '../utils/selectedRoute';
import type { SelectedRoute } from '../utils/selectedRoute';
import WidgetEmbed from './WidgetEmbed';
import './FlightWidget.css';

/**
 * FlightWidget - Renders the Travelpayouts/Aviasales flight search widget.
 * 
 * Full-page widget section (kept for SEO, long sessions, and fallback).
 * Uses shared WidgetEmbed component for consistent widget injection.
 * 
 * Future: This component will be refactored to display API-driven flight results
 * instead of the embedded widget, making it easy to swap implementations.
 */
const FlightWidget = () => {
  const [selectedRoute, setSelectedRouteState] = useState<SelectedRoute | null>(null);

  useEffect(() => {
    // Check for selected route in localStorage on mount
    const route = getSelectedRoute();
    setSelectedRouteState(route);

    // Listen for route changes from other components
    const handleRouteSelected = (event: Event) => {
      const customEvent = event as CustomEvent<SelectedRoute>;
      setSelectedRouteState(customEvent.detail);
    };

    const handleRouteCleared = () => {
      setSelectedRouteState(null);
    };

    window.addEventListener('bfd-route-selected', handleRouteSelected);
    window.addEventListener('bfd-route-cleared', handleRouteCleared);

    return () => {
      window.removeEventListener('bfd-route-selected', handleRouteSelected);
      window.removeEventListener('bfd-route-cleared', handleRouteCleared);
    };
  }, []);

  const handleClearRoute = () => {
    clearSelectedRoute();
    setSelectedRouteState(null);
  };

  return (
    <section id="flight-widget" className="flight-widget-section">
      <div className="flight-widget-container">
        <h2 className="section-title">Search flights with BigFlightDeals tools</h2>
        <p className="section-subtitle">
          Book your flights through our search tool below. Your bookings support the site via affiliate partnerships, 
          helping us keep the deals flowing and the content free.
        </p>
        {selectedRoute && (
          <div className="selected-route-indicator">
            <span className="selected-route-text">
              Selected route: {selectedRoute.originName || selectedRoute.originCode} → {selectedRoute.destinationName || selectedRoute.destinationCode}
            </span>
            <button 
              className="selected-route-change"
              onClick={handleClearRoute}
              type="button"
            >
              (change)
            </button>
          </div>
        )}
        <WidgetEmbed
          originCode={selectedRoute?.originCode}
          destinationCode={selectedRoute?.destinationCode}
          className="flight-widget-container-inner"
        />
      </div>
    </section>
  );
};

export default FlightWidget;
