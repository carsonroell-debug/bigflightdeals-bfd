import './PlannerSection.css';

const PlannerSection = () => {
  return (
    <section id="planner" className="planner-section">
      <div className="planner-container">
        <div className="planner-content">
          <h2 className="section-title">Solo Travel Planner</h2>
          <p className="planner-description">
            The exact Notion template and starter kit I use to plan every solo trip. 
            Stop juggling spreadsheets and notes—organize everything in one place.
          </p>
          <div className="planner-benefits">
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>Complete trip planning template with flights, packing, and itinerary</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>Solo Travel Starter Kit with all the tools and resources</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>Copy my exact system—no more planning from scratch</span>
            </div>
          </div>
          <div className="planner-cta">
            <button className="planner-button primary">
              Get on Gumroad
            </button>
            <button className="planner-button secondary">
              View Travel Tools
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlannerSection;
