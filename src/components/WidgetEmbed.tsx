import { useEffect, useRef, useState } from 'react';
import { injectWidget } from '../utils/widgetInjection';
import { track } from '../utils/analytics';
import { buildAffiliateSearchUrl } from '../utils/affiliateUrls';
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
 * Shows fallback if widget fails to load after 2 seconds.
 */
const WidgetEmbed = ({ originCode, destinationCode, className = '' }: WidgetEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(false);
  const hasTrackedLoadRef = useRef(false);
  const routeKeyRef = useRef<string>('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create route key to detect route changes
    const currentRouteKey = `${originCode || ''}_${destinationCode || ''}`;
    const routeChanged = routeKeyRef.current !== currentRouteKey;
    
    if (routeChanged) {
      routeKeyRef.current = currentRouteKey;
      hasTrackedLoadRef.current = false;
      // Reset fallback state asynchronously to avoid setState in effect
      queueMicrotask(() => setShowFallback(false));
    }

    // Inject widget with route if provided
    injectWidget(
      container,
      originCode,
      destinationCode
    );

    // Check if widget loaded successfully after a delay
    const checkInterval = setInterval(() => {
      if (!container || hasTrackedLoadRef.current) return;

      // Check if container has meaningful content (more than just the script tag)
      const hasContent = container.children.length > 1 || 
                       (container.textContent?.trim().length ?? 0) > 100 ||
                       container.querySelector('iframe, form, input, button');

      if (hasContent) {
        // Widget loaded successfully
        track('flight_widget_loaded', {
          origin: originCode,
          destination: destinationCode,
        });
        hasTrackedLoadRef.current = true;
        clearInterval(checkInterval);
      }
    }, 500); // Check every 500ms

    // Show fallback after 2 seconds if widget hasn't loaded
    const fallbackTimeout = setTimeout(() => {
      if (!hasTrackedLoadRef.current && container && container.children.length <= 1) {
        setShowFallback(true);
        clearInterval(checkInterval);
      }
    }, 2000);

    // Cleanup on unmount - use captured container value
    return () => {
      clearInterval(checkInterval);
      clearTimeout(fallbackTimeout);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [originCode, destinationCode]); // Re-inject when route changes

  const handleFallbackClick = () => {
    const url = buildAffiliateSearchUrl(originCode, destinationCode);
    
    if (url) {
      // Open tracked affiliate URL in new tab
      track('affiliate_click', {
        origin: originCode,
        destination: destinationCode,
        source: 'fallback',
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // No referral URL configured - scroll to homepage widget section
      console.warn('[WidgetEmbed] No VITE_TRAVELPAYOUTS_REFERRAL_URL configured. Falling back to homepage widget section.');
      track('affiliate_click', {
        origin: originCode,
        destination: destinationCode,
        source: 'fallback_homepage',
      });
      const widgetSection = document.getElementById('flight-widget');
      if (widgetSection) {
        widgetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className={`widget-embed-wrapper ${className}`}>
      <div 
        ref={containerRef} 
        className="widget-embed-container"
      />
      {showFallback && (
        <div className="widget-fallback">
          <p className="widget-fallback-message">
            Having trouble loading the search widget? Open flight search in a new tab.
          </p>
          <button 
            className="widget-fallback-button"
            onClick={handleFallbackClick}
            type="button"
          >
            Open flight search in new tab
          </button>
        </div>
      )}
    </div>
  );
};

export default WidgetEmbed;
