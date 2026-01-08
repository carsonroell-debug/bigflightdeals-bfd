import { sampleDeals } from '../data/deals';
import { executeMission, enrichMission } from '../utils/missionExecution';
import type { Mission } from '../types/mission';
import './FlightDealsSection.css';

interface FlightDealsSectionProps {
  onRunMission: (mission: Mission) => void;
}

const FlightDealsSection = ({ onRunMission }: FlightDealsSectionProps) => {
  const handleRunMission = (deal: typeof sampleDeals[0]) => {
    // Create mission input from deal
    const missionInput: Mission = {
      origin: deal.originCode,
      destination: deal.destinationCode,
      travelerType: 'solo', // All deals are solo-focused
      originName: deal.from,
      destinationName: deal.to,
      // Optional: could add budget from deal.price if needed
      budget: {
        amount: deal.price,
        currency: deal.currency,
      },
    };

    // Execute mission (locks route, emits GA4 event)
    executeMission(missionInput);

    // Enrich with display names and trigger modal
    const enrichedMission = enrichMission(
      missionInput,
      deal.from,
      deal.to
    );
    
    // Trigger modal open at App level (no scrolling)
    onRunMission(enrichedMission);
  };

  return (
    <section id="deals" className="deals-section">
      <div className="deals-container">
        <h2 className="section-title">Featured Solo Flight Targets</h2>
        <p className="section-subtitle">
          Real deal windows for budget solo travel. Prices are target ranges—actual deals vary by season and booking timing.
        </p>
        <p className="deals-helper-text">
          Pick a route you like, then hit 'Run this mission' to scan live prices instantly.
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
                onClick={() => handleRunMission(deal)}
              >
                Run this mission
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlightDealsSection;
