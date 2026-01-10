/**
 * RoutesIndex
 *
 * SEO landing page listing all flight routes grouped by region.
 * Targets transactional queries like "cheap flights from Toronto".
 */

import { Link } from 'react-router-dom';
import { routes, getRoutesByRegion } from '../data/routes';
import { useSEO } from '../utils/useSEO';
import './RoutesIndex.css';

const RoutesIndex = () => {
  useSEO({
    title: 'Cheap Solo Travel Flights | Best Flight Deals 2025',
    description: 'Find cheap flights for solo travelers from North America and Europe to 45+ destinations worldwide. Compare prices, discover the best months to fly, and book budget-friendly flights.',
    keywords: ['cheap flights', 'solo travel flights', 'budget flights', 'flight deals', 'cheap flights to europe', 'cheap flights to asia'],
  });

  const byRegion = getRoutesByRegion();
  const regionOrder = ['Europe', 'UK & Ireland', 'Nordics', 'Asia', 'Americas', 'Caribbean'];

  return (
    <div className="routes-index">
      {/* Hero */}
      <section className="routes-hero">
        <div className="routes-hero-content">
          <h1>Solo Travel Flight Deals</h1>
          <p className="routes-hero-subtitle">
            Find the best flight deals for solo travelers worldwide.
            Budget-focused routes from 14 hub cities to 45+ destinations.
          </p>
          <div className="routes-hero-stats">
            <span className="routes-stat">{routes.length} routes</span>
            <span className="routes-stat-divider">|</span>
            <span className="routes-stat">14 origin cities</span>
            <span className="routes-stat-divider">|</span>
            <span className="routes-stat">Updated weekly</span>
          </div>
        </div>
      </section>

      {/* Routes by Region */}
      {regionOrder.map((region) => {
        const regionRoutes = byRegion[region];
        if (!regionRoutes?.length) return null;

        return (
          <section key={region} className="routes-region">
            <div className="routes-region-content">
              <h2 className="routes-region-title">{region}</h2>
              <div className="routes-grid">
                {regionRoutes.map((route) => (
                  <Link
                    key={route.slug}
                    to={`/routes/${route.slug}`}
                    className="route-card"
                  >
                    <div className="route-card-header">
                      <span className="route-card-codes">
                        {route.originIata} → {route.destIata}
                      </span>
                      <span className="route-card-price">
                        From ${route.budgetRange.min}
                      </span>
                    </div>
                    <h3 className="route-card-title">
                      {route.originCity} to {route.destCity}
                    </h3>
                    <p className="route-card-country">{route.destCountry}</p>
                    <div className="route-card-meta">
                      <span className="route-card-duration">
                        {route.tripLengthDays} days suggested
                      </span>
                    </div>
                    <div className="route-card-tags">
                      {route.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="route-tag">{tag}</span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Bottom CTA */}
      <section className="routes-bottom-cta">
        <div className="routes-cta-content">
          <h2>Not finding your route?</h2>
          <p>Tell us where you want to go and we'll find the best deals.</p>
          <Link to="/#mission-input" className="routes-cta-button">
            Start a Mission
          </Link>
        </div>
      </section>
    </div>
  );
};

export default RoutesIndex;
