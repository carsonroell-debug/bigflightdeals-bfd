/**
 * RoutePage
 *
 * SEO-optimized individual route page targeting transactional queries
 * like "Toronto to Lisbon flights". Funnels users into Mission Engine.
 */

import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getRouteBySlug, routeToMission } from '../data/routes';
import { executeMission } from '../utils/executeMission';
import { useSEO } from '../utils/useSEO';
import { track } from '../utils/analytics';
import type { MissionV1 } from '../types/mission';
import './RoutePage.css';

interface RoutePageProps {
  onRunMission: (mission: MissionV1) => void;
}

const RoutePage = ({ onRunMission }: RoutePageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const route = slug ? getRouteBySlug(slug) : undefined;

  // SEO
  useSEO({
    title: route
      ? `Cheap Flights from ${route.originCity} to ${route.destCity} | BigFlightDeals`
      : 'Route Not Found | BigFlightDeals',
    description: route
      ? `Find cheap flights from ${route.originCity} to ${route.destCity}. Best months to fly, budget tips, and deals starting from $${route.budgetRange.min} ${route.budgetRange.currency}.`
      : 'Route not found.',
    keywords: route
      ? [
          `${route.originCity.toLowerCase()} to ${route.destCity.toLowerCase()} flights`,
          `cheap flights ${route.destCity.toLowerCase()}`,
          `${route.originIata} to ${route.destIata}`,
          `budget flights ${route.destCountry.toLowerCase()}`,
        ]
      : [],
  });

  // Track page view
  useEffect(() => {
    if (route) {
      track('route_page_view', {
        route_slug: route.slug,
        origin: route.originIata,
        destination: route.destIata,
      });
    }
  }, [route]);

  if (!route) {
    return <Navigate to="/routes" replace />;
  }

  const handleStartMission = () => {
    track('route_mission_started', {
      route_slug: route.slug,
      origin: route.originIata,
      destination: route.destIata,
      cta_type: 'primary',
    });

    const mission = routeToMission(route);
    const result = executeMission(mission, { openModal: true });
    onRunMission(result.mission);
  };

  const handleSearchPrices = () => {
    track('route_mission_started', {
      route_slug: route.slug,
      origin: route.originIata,
      destination: route.destIata,
      cta_type: 'secondary',
    });

    const mission = routeToMission(route);
    const result = executeMission(mission, { openModal: true });
    onRunMission(result.mission);
  };

  const budgetMid = Math.round((route.budgetRange.min + route.budgetRange.max) / 2);

  return (
    <div className="route-page">
      {/* Hero */}
      <section className="rp-hero">
        <div className="rp-hero-content">
          <div className="rp-breadcrumb">
            <Link to="/routes">Routes</Link>
            <span>/</span>
            <span>{route.originCity} to {route.destCity}</span>
          </div>
          <h1>Cheap Flights from {route.originCity} to {route.destCity}</h1>
          <p className="rp-hero-subtitle">
            {route.originIata} → {route.destIata} | From ${route.budgetRange.min} {route.budgetRange.currency}
          </p>
          <div className="rp-hero-ctas">
            <button className="rp-cta-primary" onClick={handleStartMission}>
              Run This Route as a Mission
            </button>
            <button className="rp-cta-secondary" onClick={handleSearchPrices}>
              Search Live Prices
            </button>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="rp-intro">
        <div className="rp-section-content">
          <h2>Flying from {route.originCity} to {route.destCity}</h2>
          <p>
            Looking for cheap flights from {route.originCity} to {route.destCity}?
            This route takes you from Canada to {route.destCountry}, with flights
            typically ranging from ${route.budgetRange.min} to ${route.budgetRange.max} {route.budgetRange.currency}
            depending on the season and how far ahead you book.
          </p>
          <p>
            For solo travelers, this is one of the most popular routes from {route.originCity}.
            With a suggested trip length of {route.tripLengthDays} days, you'll have enough time
            to explore {route.destCity} without rushing. Use our mission system to track prices
            and get alerts when deals drop.
          </p>
          <p>
            The best strategy? Be flexible with your dates, book 2-3 months ahead for
            shoulder season, and consider flying on Tuesday or Wednesday for the lowest fares.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="rp-stats">
        <div className="rp-section-content">
          <div className="rp-stats-grid">
            <div className="rp-stat-card">
              <span className="rp-stat-label">Best Months to Fly</span>
              <span className="rp-stat-value">{route.bestMonths.slice(0, 3).join(', ')}</span>
            </div>
            <div className="rp-stat-card">
              <span className="rp-stat-label">Typical Budget</span>
              <span className="rp-stat-value">${budgetMid} {route.budgetRange.currency}</span>
            </div>
            <div className="rp-stat-card">
              <span className="rp-stat-label">Suggested Trip Length</span>
              <span className="rp-stat-value">{route.tripLengthDays} days</span>
            </div>
            <div className="rp-stat-card">
              <span className="rp-stat-label">Destination</span>
              <span className="rp-stat-value">{route.destCity}, {route.destCountry}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Best Months */}
      <section className="rp-section">
        <div className="rp-section-content">
          <h2>Best Months to Fly {route.originCity} to {route.destCity}</h2>
          <p>
            Based on historical pricing and weather patterns, the best months to fly
            from {route.originCity} to {route.destCity} are:
          </p>
          <ul className="rp-month-list">
            {route.bestMonths.map((month) => (
              <li key={month}>{month}</li>
            ))}
          </ul>
          <p>
            During these months, you'll find a balance of reasonable prices and
            good weather at your destination. Peak season typically means higher
            prices but may be worth it for specific events or climate preferences.
          </p>
        </div>
      </section>

      {/* Budget Breakdown */}
      <section className="rp-section rp-section-alt">
        <div className="rp-section-content">
          <h2>Solo Budget for {route.destCity}</h2>
          <div className="rp-budget-breakdown">
            <div className="rp-budget-item">
              <span className="rp-budget-label">Flight (Round Trip)</span>
              <span className="rp-budget-value">
                ${route.budgetRange.min} - ${route.budgetRange.max} {route.budgetRange.currency}
              </span>
            </div>
            <div className="rp-budget-item">
              <span className="rp-budget-label">Suggested Trip Length</span>
              <span className="rp-budget-value">{route.tripLengthDays} days</span>
            </div>
          </div>
          <p className="rp-budget-note">
            Prices vary based on booking time, season, and flexibility.
            Create a mission to track this route and get notified when prices drop.
          </p>
        </div>
      </section>

      {/* How to Find Best Deal */}
      <section className="rp-section">
        <div className="rp-section-content">
          <h2>How to Find the Best Deal</h2>
          <ul className="rp-tips-list">
            <li>
              <strong>Book 6-8 weeks ahead</strong> for the sweet spot between availability and price
            </li>
            <li>
              <strong>Fly mid-week</strong> — Tuesday and Wednesday typically have the lowest fares
            </li>
            <li>
              <strong>Use our mission system</strong> — set up a mission for this route and get alerted when prices drop
            </li>
            <li>
              <strong>Be flexible with dates</strong> — even shifting by 1-2 days can save $100+
            </li>
            <li>
              <strong>Consider nearby airports</strong> — sometimes flying into a nearby city is cheaper
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="rp-section rp-section-alt">
        <div className="rp-section-content">
          <h2>Frequently Asked Questions</h2>
          <div className="rp-faq">
            <div className="rp-faq-item">
              <h3>How long is the flight from {route.originCity} to {route.destCity}?</h3>
              <p>
                Direct flights from {route.originIata} to {route.destIata} vary depending on the route,
                but expect approximately 6-14 hours depending on destination.
                Connecting flights may take longer but can sometimes be cheaper.
              </p>
            </div>
            <div className="rp-faq-item">
              <h3>What's the cheapest month to fly to {route.destCity}?</h3>
              <p>
                Shoulder season months like {route.bestMonths[0]} and {route.bestMonths[route.bestMonths.length - 1]} typically
                offer the best balance of price and weather. Avoid peak holiday periods
                when prices spike.
              </p>
            </div>
            <div className="rp-faq-item">
              <h3>Is {route.destCity} good for solo travelers?</h3>
              <p>
                Yes! This route is popular with solo travelers. {route.destCity} offers
                {route.tags.includes('solo') ? ' excellent solo travel infrastructure' : ' great experiences for independent travelers'},
                {route.tags.includes('budget') ? ' budget-friendly options,' : ''} and
                {route.tags.includes('safe') ? ' a safe environment' : ' plenty to explore on your own'}.
              </p>
            </div>
            <div className="rp-faq-item">
              <h3>How do I track prices for this route?</h3>
              <p>
                Use our mission system! Click "Run This Route as a Mission" above, and
                we'll help you track this route and find the best deals. You can save
                your mission and come back to check prices anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="rp-bottom-cta">
        <div className="rp-section-content">
          <h2>Ready to Book?</h2>
          <p>Start a mission and find the best prices for {route.originCity} to {route.destCity}.</p>
          <div className="rp-hero-ctas">
            <button className="rp-cta-primary" onClick={handleStartMission}>
              Run This Route as a Mission
            </button>
            <Link to="/routes" className="rp-cta-secondary">
              Browse All Routes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoutePage;
