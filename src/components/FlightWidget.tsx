import { useEffect, useRef } from 'react';
import './FlightWidget.css';

/**
 * Travelpayouts/Aviasales widget snippet.
 * 
 * Future: This will be replaced with API-driven flight search results
 * when the agentic flight concierge feature is implemented.
 */
const TRAVELPAYOUTS_WIDGET_SNIPPET = `
<script async src="https://tpwdgt.com/content?currency=usd&trs=387747&shmarker=605276&show_hotels=true&powered_by=true&locale=en&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=%2332a8dd&color_icons=%2332a8dd&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&plain=false&promo_id=7879&campaign_id=100" charset="utf-8"></script>
`;

/**
 * FlightWidget - Renders the Travelpayouts/Aviasales flight search widget.
 * 
 * This component injects the widget HTML snippet and ensures all scripts execute
 * correctly in React, preserving affiliate tracking and handling re-renders safely.
 * 
 * Future: This component will be refactored to display API-driven flight results
 * instead of the embedded widget, making it easy to swap implementations.
 */
const FlightWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guard: ensure container exists
    if (!containerRef.current) {
      console.warn('[FlightWidget] Container ref is null, cannot inject widget');
      return;
    }

    // Clear any existing content to prevent duplicates
    containerRef.current.innerHTML = '';

    // Inject the widget snippet HTML
    containerRef.current.innerHTML = TRAVELPAYOUTS_WIDGET_SNIPPET;

    // Find all script tags in the injected HTML
    // Scripts injected via innerHTML don't execute automatically, so we must re-execute them
    const scriptTags = containerRef.current.querySelectorAll('script');
    const scriptCount = scriptTags.length;

    if (scriptCount === 0) {
      console.warn('[FlightWidget] No script tags found in widget snippet');
      return;
    }

    console.log(`[FlightWidget] Found ${scriptCount} script tag(s), re-executing...`);

    // Process each script tag to ensure it executes
    // This preserves affiliate tracking and ensures the widget initializes correctly
    scriptTags.forEach((oldScript, index) => {
      // Create a new script element (only new script elements execute)
      const newScript = document.createElement('script');

      // Copy all attributes from the old script (src, async, charset, data-*, etc.)
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // Copy inline JavaScript if present
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }

      // Set sensible defaults if not present
      if (!newScript.hasAttribute('async')) {
        newScript.async = true;
      }
      if (!newScript.hasAttribute('charset')) {
        newScript.charset = 'utf-8';
      }

      // Replace the old script with the new one (this triggers execution)
      if (oldScript.parentNode) {
        oldScript.parentNode.replaceChild(newScript, oldScript);
        console.log(`[FlightWidget] Script ${index + 1}/${scriptCount} re-executed`);
      }
    });

    console.log(`[FlightWidget] Widget injection complete. ${scriptCount} script(s) re-executed.`);

    // Cleanup: only clear on unmount, not on re-renders
    // This ensures the widget persists through React re-renders
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount only

  return (
    <section id="flight-widget" className="flight-widget-section">
      <div className="flight-widget-container">
        <h2 className="section-title">Search flights with BigFlightDeals tools</h2>
        <p className="section-subtitle">
          Book your flights through our search tool below. Your bookings support the site via affiliate partnerships, 
          helping us keep the deals flowing and the content free.
        </p>
        <div 
          ref={containerRef} 
          className="flight-widget-container-inner"
          id="travelpayouts-widget"
        />
      </div>
    </section>
  );
};

export default FlightWidget;
