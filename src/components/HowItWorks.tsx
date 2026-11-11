import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Start with the route',
      description: 'Search current fares for the route and dates that work for your trip.',
    },
    {
      number: '02',
      title: 'Compare the details',
      description: 'Look at baggage, connections and fare conditions as well as the ticket price.',
    },
    {
      number: '03',
      title: 'Plan your arrival',
      description: 'Check your arrival airport, transport, accommodation and mobile connectivity.',
    },
    {
      number: '04',
      title: 'Book with confidence',
      description: 'Verify current prices and terms with the provider before you pay.',
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="how-it-works-container">
        <h2 className="section-title">How it works</h2>
        <p className="section-subtitle">
          A practical approach to comparing your options.
        </p>
        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
