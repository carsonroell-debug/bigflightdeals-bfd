import { useEffect, useRef } from 'react';
import './FlightWidget.css';

// TODO: Replace with your actual Travelpayouts widget snippet
// Paste the full HTML snippet (including div and script tags) here
const TRAVELPAYOUTS_WIDGET_SNIPPET = `
PASTE_WIDGET_SNIPPET_HERE
`;

const FlightWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.warn('[FlightWidget] Container ref is null, cannot inject widget');
      return;
    }

    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Inject the widget snippet HTML
    containerRef.current.innerHTML = TRAVELPAYOUTS_WIDGET_SNIPPET;

    // Find all script tags in the injected HTML
    const scriptTags = containerRef.current.querySelectorAll('script');
    const scriptCount = scriptTags.length;

    if (scriptCount === 0) {
      console.warn('[FlightWidget] No script tags found in widget snippet');
      return;
    }

    console.log(`[FlightWidget] Found ${scriptCount} script tag(s), executing...`);

    // Process each script tag to ensure it executes
    scriptTags.forEach((oldScript, index) => {
      // Create a new script element
      const newScript = document.createElement('script');

      // Copy all attributes from the old script
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // Copy inline JavaScript if present
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }

      // Set default attributes if not present
      if (!newScript.hasAttribute('async')) {
        newScript.async = true;
      }
      if (!newScript.hasAttribute('charset')) {
        newScript.charset = 'utf-8';
      }

      // Replace the old script with the new one (this triggers execution)
      if (oldScript.parentNode) {
        oldScript.parentNode.replaceChild(newScript, oldScript);
        console.log(`[FlightWidget] Script ${index + 1}/${scriptCount} executed`);
      }
    });

    console.log(`[FlightWidget] Widget injection complete. ${scriptCount} script(s) processed.`);

    // Cleanup function - only clear on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

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
