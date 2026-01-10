/**
 * PopularRoutesSection
 *
 * Homepage section showing top 6 popular routes with semantic links.
 * Provides internal linking for SEO and funnels users to route pages.
 */

import { Link } from 'react-router-dom';
import { getPopularRoutes } from '../data/routes';
import './PopularRoutesSection.css';

const PopularRoutesSection = () => {
  const popularRoutes = getPopularRoutes(6);

  return (
    <section id="popular-routes" className="popular-routes-section">
      <div className="popular-routes-container">
        <h2 className="popular-routes-title">Popular Routes</h2>
        <p className="popular-routes-subtitle">
          Trending flight routes from Toronto. Click to explore prices and deals.
        </p>

        <div className="popular-routes-grid">
          {popularRoutes.map((route) => (
            <Link
              key={route.slug}
              to={`/routes/${route.slug}`}
              className="popular-route-card"
            >
              <div className="popular-route-header">
                <span className="popular-route-codes">
                  {route.originIata} → {route.destIata}
                </span>
                <span className="popular-route-price">
                  From ${route.budgetRange.min}
                </span>
              </div>
              <h3 className="popular-route-title">
                {route.originCity} to {route.destCity}
              </h3>
              <p className="popular-route-country">{route.destCountry}</p>
              <div className="popular-route-tags">
                {route.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="popular-route-tag">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="popular-routes-cta">
          <Link to="/routes" className="popular-routes-link">
            View All Routes →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularRoutesSection;
