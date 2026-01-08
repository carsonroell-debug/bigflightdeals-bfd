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
    if (!containerRef.current) return;

    // Inject widget with route if provided
    injectWidget(
      containerRef.current,
      originCode,
      destinationCode
    );

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
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
