/**
 * DestinationPage
 *
 * SEO-optimized solo destination page template.
 * Static, crawlable content that feeds into Mission Engine.
 */

import { useParams, Link } from 'react-router-dom';
import { getDestinationBySlug, destinationToMission } from '../data/destinations';
import { executeMission } from '../utils/executeMission';
import { track } from '../utils/analytics';
import { useSEO } from '../utils/useSEO';
import type { MissionV1 } from '../types/mission';
import './DestinationPage.css';

interface DestinationPageProps {
  onRunMission: (mission: MissionV1) => void;
}

const DestinationPage = ({ onRunMission }: DestinationPageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const destination = slug ? getDestinationBySlug(slug) : undefined;

  // SEO
  useSEO({
    title: destination?.seo.title || 'Destination Not Found | BigFlightDeals',
    description: destination?.seo.description || 'Explore solo travel destinations with BigFlightDeals.',
    keywords: destination?.seo.keywords,
  });

  if (!destination) {
    return (
      <div className="destination-page">
        <div className="destination-not-found">
          <h1>Destination Not Found</h1>
          <p>Sorry, we couldn't find that destination.</p>
          <Link to="/destinations" className="back-link">
            ← Browse all destinations
          </Link>
        </div>
      </div>
    );
  }

  const handleRunMission = () => {
    const mission = destinationToMission(destination);
    const result = executeMission(mission, { openModal: true });

    track('destination_mission_launched', {
      slug: destination.slug,
      origin: destination.originCode,
      destination: destination.destinationCode,
    });

    onRunMission(result.mission);
  };

  return (
    <div className="destination-page">
      {/* Hero Section */}
      <section className="dest-hero">
        <div className="dest-hero-content">
          <div className="dest-breadcrumb">
            <Link to="/">Home</Link> → <Link to="/destinations">Destinations</Link> → {destination.destinationName}
          </div>
          <h1 className="dest-title">
            Solo Travel to {destination.destinationName}
          </h1>
          <p className="dest-tagline">{destination.hero.tagline}</p>
          <div className="dest-route-badge">
            {destination.originName} → {destination.destinationName}
          </div>
          <p className="dest-hero-description">{destination.hero.description}</p>
          <button
            className="dest-cta-button"
            onClick={handleRunMission}
            type="button"
          >
            Search flights from ${destination.flightBudget.low} {destination.flightBudget.currency}
          </button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="dest-stats">
        <div className="dest-stats-grid">
          <div className="dest-stat">
            <span className="dest-stat-value">{destination.soloScore}/10</span>
            <span className="dest-stat-label">Solo Score</span>
          </div>
          <div className="dest-stat">
            <span className="dest-stat-value">${destination.flightBudget.typical}</span>
            <span className="dest-stat-label">Typical Flight ({destination.flightBudget.currency})</span>
          </div>
          <div className="dest-stat">
            <span className="dest-stat-value">${destination.dailyBudget.budget}-{destination.dailyBudget.mid}</span>
            <span className="dest-stat-label">Daily Budget ({destination.dailyBudget.currency})</span>
          </div>
          <div className="dest-stat">
            <span className="dest-stat-value">{destination.idealTripLength.min}-{destination.idealTripLength.max}</span>
            <span className="dest-stat-label">Ideal Days</span>
          </div>
        </div>
      </section>

      {/* Why Go */}
      <section className="dest-section">
        <div className="dest-section-content">
          <h2>Why {destination.destinationName} for Solo Travel?</h2>
          <p className="dest-why-text">{destination.sections.whyGo}</p>
          <div className="dest-highlights">
            <h3>Solo Highlights</h3>
            <ul className="dest-highlights-list">
              {destination.soloHighlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Best Time to Visit */}
      <section className="dest-section alt">
        <div className="dest-section-content">
          <h2>Best Time to Visit</h2>
          <div className="dest-timing">
            <div className="dest-timing-block good">
              <h3>Best Months</h3>
              <div className="dest-months">
                {destination.bestMonths.map((month) => (
                  <span key={month} className="dest-month good">{month}</span>
                ))}
              </div>
            </div>
            {destination.avoidMonths.length > 0 && (
              <div className="dest-timing-block avoid">
                <h3>Consider Avoiding</h3>
                <div className="dest-months">
                  {destination.avoidMonths.map((month) => (
                    <span key={month} className="dest-month avoid">{month}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="dest-section">
        <div className="dest-section-content">
          <h2>Where to Stay</h2>
          <div className="dest-neighborhoods">
            {destination.sections.neighborhoods.map((hood) => (
              <div key={hood.name} className="dest-neighborhood">
                <h3>{hood.name}</h3>
                <p>{hood.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solo Tips */}
      <section className="dest-section alt">
        <div className="dest-section-content">
          <h2>Solo Travel Tips</h2>
          <ul className="dest-tips-list">
            {destination.sections.soloTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Day Trips */}
      <section className="dest-section">
        <div className="dest-section-content">
          <h2>Day Trips from {destination.destinationName}</h2>
          <div className="dest-daytrips">
            {destination.sections.dayTrips.map((trip, i) => (
              <div key={i} className="dest-daytrip">{trip}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Practical Info */}
      <section className="dest-section alt">
        <div className="dest-section-content">
          <h2>Practical Information</h2>
          <div className="dest-practical-grid">
            <div className="dest-practical-item">
              <strong>Visa</strong>
              <p>{destination.visaInfo}</p>
            </div>
            <div className="dest-practical-item">
              <strong>Timezone</strong>
              <p>{destination.timezone}</p>
            </div>
            <div className="dest-practical-item">
              <strong>Languages</strong>
              <p>{destination.languages.join(', ')}</p>
            </div>
            <div className="dest-practical-item">
              <strong>Safety</strong>
              <p className={`safety-${destination.safetyRating}`}>
                {destination.safetyRating.charAt(0).toUpperCase() + destination.safetyRating.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vibes Tags */}
      <section className="dest-section">
        <div className="dest-section-content">
          <h2>The Vibe</h2>
          <div className="dest-vibes">
            {destination.vibes.map((vibe) => (
              <span key={vibe} className="dest-vibe-tag">{vibe}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="dest-cta-section">
        <div className="dest-cta-content">
          <h2>Ready for {destination.destinationName}?</h2>
          <p>
            Search flights from {destination.originName} starting at ${destination.flightBudget.low} {destination.flightBudget.currency}.
          </p>
          <button
            className="dest-cta-button large"
            onClick={handleRunMission}
            type="button"
          >
            Run this mission
          </button>
        </div>
      </section>
    </div>
  );
};

export default DestinationPage;
