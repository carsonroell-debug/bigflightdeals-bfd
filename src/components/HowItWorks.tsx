import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Find real deal windows',
      description: 'Get alerts when flights actually drop to budget-friendly prices. No fake "$20 a day" promises—just real deals during actual low seasons.',
    },
    {
      number: '02',
      title: 'Pack lean and smart',
      description: 'Learn the exact packing system that lets you travel solo with just a carry-on. No checked bags, no stress, no extra fees.',
    },
    {
      number: '03',
      title: 'Use the right tools',
      description: 'One clear pick per category: flight search, eSIM, insurance, booking. No analysis paralysis—just the tools that actually work.',
    },
    {
      number: '04',
      title: 'Plan with narrative itineraries',
      description: 'Get honest, story-driven trip plans that show you how to actually experience a place, not just check boxes.',
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="how-it-works-container">
        <h2 className="section-title">How it works</h2>
        <p className="section-subtitle">
          Your travel buddy approach: real deals, honest advice, one clear tool per category.
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
