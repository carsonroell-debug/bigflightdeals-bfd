import { sampleDeals } from '../data/deals';
import './FlightDealsSection.css';

const FlightDealsSection = () => {
  const scrollToWidget = () => {
    const element = document.getElementById('flight-widget');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="deals" className="deals-section">
      <div className="deals-container">
        <h2 className="section-title">Featured Solo Flight Targets</h2>
        <p className="section-subtitle">
          Real deal windows for budget solo travel. Prices are target ranges—actual deals vary by season and booking timing.
        </p>
        <div className="deals-grid">
          {sampleDeals.map((deal) => (
            <div key={deal.id} className="deal-card">
              <div className="deal-route">
                <span className="deal-city">{deal.from}</span>
                <span className="deal-arrow">→</span>
                <span className="deal-city">{deal.to}</span>
              </div>
              <div className="deal-price">
                <span className="deal-amount">{deal.price}</span>
                <span className="deal-currency">{deal.currency}</span>
              </div>
              {deal.bestSeason && (
                <div className="deal-season">
                  <span className="season-label">Best season:</span>
                  <span className="season-value">{deal.bestSeason}</span>
                </div>
              )}
              {deal.notes && (
                <p className="deal-notes">{deal.notes}</p>
              )}
              <button 
                className="deal-button"
                onClick={scrollToWidget}
              >
                Search this route
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlightDealsSection;
