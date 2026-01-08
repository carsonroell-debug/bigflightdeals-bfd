import './PlannerSection.css';

const PlannerSection = () => {
  return (
    <section id="solo-planner" className="planner-section">
      <div className="planner-container">
        <div className="planner-content">
          <h2 className="section-title">Solo Travel Toolkit</h2>
          <p className="planner-description">
            The exact Notion template and starter kit I use to plan every solo trip. 
            Stop juggling spreadsheets and notes—organize everything in one place.
          </p>
          <div className="planner-products">
            <div className="product-card">
              <h3 className="product-title">Notion Solo Travel Planner</h3>
              <p className="product-description">
                Complete trip planning template with flights, packing lists, and itineraries. 
                Copy my exact system—no more planning from scratch.
              </p>
            </div>
            <div className="product-card">
              <h3 className="product-title">Solo Travel Starter Kit</h3>
              <p className="product-description">
                PDF guide with all the tools, resources, and checklists you need for your first solo trip.
              </p>
            </div>
          </div>
          <div className="planner-cta">
            {/* TODO: Replace with actual Gumroad URL for Notion Solo Travel Planner */}
            <a 
              href="https://gumroad.com/...PLANNER_URL_HERE..." 
              target="_blank" 
              rel="noopener noreferrer"
              className="planner-button primary"
            >
              Open the Solo Travel Planner
            </a>
            {/* TODO: Replace with actual Gumroad URL or free lead magnet link for Starter Kit */}
            <a 
              href="https://gumroad.com/...STARTER_KIT_URL_HERE..." 
              target="_blank" 
              rel="noopener noreferrer"
              className="planner-button secondary"
            >
              Get the Starter Kit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlannerSection;
