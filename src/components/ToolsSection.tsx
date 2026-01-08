import './ToolsSection.css';

const ToolsSection = () => {
  const tools = [
    {
      category: 'Flight Search',
      name: 'Google Flights',
      description: 'The only flight search tool you need. Set price alerts, explore flexible dates, and find real deals.',
      placeholder: 'google.com/flights',
    },
    {
      category: 'Travel Planner',
      name: 'Notion Solo Travel Planner',
      description: 'The exact template I use to plan every trip. Organize flights, packing lists, and itineraries in one place.',
      placeholder: 'Gumroad / Travel Tools page',
    },
    {
      category: 'eSIM',
      name: 'Airalo',
      description: 'Get data in 190+ countries without swapping SIM cards. Perfect for solo travellers hopping between countries.',
      placeholder: 'airalo.com',
    },
    {
      category: 'Travel Insurance',
      name: 'SafetyWing',
      description: 'Affordable coverage that works for long-term solo travel. No home country requirement, cancel anytime.',
      placeholder: 'safetywing.com',
    },
    {
      category: 'Booking',
      name: 'Booking.com',
      description: 'Best for flexible cancellation policies. Book now, pay later, cancel free—essential for solo budget travel.',
      placeholder: 'booking.com',
    },
  ];

  return (
    <section id="tools" className="tools-section">
      <div className="tools-container">
        <h2 className="section-title">Travel Tools</h2>
        <p className="section-subtitle">
          One clear pick per category. No analysis paralysis—just the tools that actually work for solo budget travel.
        </p>
        <div className="tools-grid">
          {tools.map((tool, index) => (
            <div key={index} className="tool-card">
              <div className="tool-category">{tool.category}</div>
              <h3 className="tool-name">{tool.name}</h3>
              <p className="tool-description">{tool.description}</p>
              <div className="tool-link-placeholder">
                {tool.placeholder}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
