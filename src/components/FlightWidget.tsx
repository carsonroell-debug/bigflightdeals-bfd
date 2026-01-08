import { useEffect, useRef } from 'react';
import './FlightWidget.css';

const FlightWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Create script element for Travelpayouts widget
    const script = document.createElement('script');
    
    // TODO: replace with my actual Travelpayouts widget src
    // Example format: https://tp.media/content?promo_id=XXXX&shmarker=XXXXX&trs=XXXXX&locale=en&powered_by=true
    script.src = "https://tp.media/content?...MY_PARAMS_HERE...";
    
    script.async = true;
    script.charset = 'utf-8';

    // Append script to container
    containerRef.current.appendChild(script);

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

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
