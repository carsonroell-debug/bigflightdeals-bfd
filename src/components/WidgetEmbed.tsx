import { useEffect, useRef } from 'react';
import { injectWidget } from '../utils/widgetInjection';
import './WidgetEmbed.css';

interface WidgetEmbedProps {
  originCode?: string;
  destinationCode?: string;
  className?: string;
}

/**
 * WidgetEmbed - Reusable component that injects the Aviasales widget.
 * 
 * Used by both FlightWidget (full-page) and MissionModal (modal).
 * Automatically re-injects when originCode or destinationCode changes.
 */
const WidgetEmbed = ({ originCode, destinationCode, className = '' }: WidgetEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Inject widget with route if provided
    injectWidget(
      container,
      originCode,
      destinationCode
    );

    // Cleanup on unmount - use captured container value
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [originCode, destinationCode]); // Re-inject when route changes

  return (
    <div 
      ref={containerRef} 
      className={`widget-embed-container ${className}`}
    />
  );
};

export default WidgetEmbed;
