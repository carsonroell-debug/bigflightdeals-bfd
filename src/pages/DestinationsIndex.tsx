/**
 * DestinationsIndex
 *
 * SEO landing page listing all solo travel destinations.
 */

import { Link } from 'react-router-dom';
import { destinations } from '../data/destinations';
import { useSEO } from '../utils/useSEO';
import './DestinationsIndex.css';

const DestinationsIndex = () => {
  useSEO({
    title: 'Solo Travel Destinations from Toronto | BigFlightDeals',
    description: 'Explore the best solo travel destinations from Toronto. Budget flights, local tips, and complete guides for independent travelers.',
    keywords: ['solo travel destinations', 'toronto flights', 'budget travel', 'solo trip ideas', 'cheap flights from toronto'],
  });

  // Group destinations by region
  const byRegion = destinations.reduce<Record<string, typeof destinations>>((acc, dest) => {
    if (!acc[dest.region]) {
      acc[dest.region] = [];
    }
    acc[dest.region].push(dest);
    return acc;
  }, {});

  return (
    <div className="destinations-index">
      {/* Hero */}
      <section className="desti-hero">
        <div className="desti-hero-content">
          <h1>Solo Travel Destinations</h1>
          <p className="desti-hero-subtitle">
            Curated destinations for independent travelers.
            Real prices, honest tips, no fluff.
          </p>
          <div className="desti-hero-stats">
            <span className="desti-stat">{destinations.length} destinations</span>
            <span className="desti-stat-divider">•</span>
            <span className="desti-stat">All from Toronto</span>
            <span className="desti-stat-divider">•</span>
            <span className="desti-stat">Solo-tested</span>
          </div>
        </div>
      </section>

      {/* Destinations by Region */}
      {Object.entries(byRegion).map(([region, regionDests]) => (
        <section key={region} className="desti-region">
          <div className="desti-region-content">
            <h2 className="desti-region-title">{region}</h2>
            <div className="desti-grid">
              {regionDests.map((dest) => (
                <Link
                  key={dest.slug}
                  to={`/destinations/${dest.slug}`}
                  className="desti-card"
                >
                  <div className="desti-card-header">
                    <span className="desti-card-code">{dest.destinationCode}</span>
                    <span className="desti-card-score">{dest.soloScore}/10</span>
                  </div>
                  <h3 className="desti-card-name">{dest.destinationName}</h3>
                  <p className="desti-card-country">{dest.country}</p>
                  <p className="desti-card-tagline">{dest.hero.tagline}</p>
                  <div className="desti-card-meta">
                    <span className="desti-card-price">
                      From ${dest.flightBudget.low} {dest.flightBudget.currency}
                    </span>
                  </div>
                  <div className="desti-card-vibes">
                    {dest.vibes.slice(0, 3).map((vibe) => (
                      <span key={vibe} className="desti-vibe">{vibe}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Bottom CTA */}
      <section className="desti-bottom-cta">
        <div className="desti-cta-content">
          <h2>Not sure where to go?</h2>
          <p>Tell us your budget and vibe, and we'll suggest the perfect destination.</p>
          <Link to="/#mission-input" className="desti-cta-button">
            Try Mission Input
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DestinationsIndex;
