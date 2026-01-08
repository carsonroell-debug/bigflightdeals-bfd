import './AboutSection.css';

const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2 className="section-title">Why BigFlightDeals exists</h2>
        <div className="about-content">
          <p className="about-text">
            I'm a solo budget traveller, and I got tired of the same old problem: 
            every flight search tool shows you the same prices, and every travel blog 
            promises "$20 a day" trips that don't exist.
          </p>
          <p className="about-text">
            BigFlightDeals is your travel buddy—not another generic search engine. 
            I share the exact tools I use, the real deal windows when flights actually drop, 
            and honest itineraries that show you how to actually experience a place without 
            breaking the bank.
          </p>
          <p className="about-text">
            No fake promises. No analysis paralysis. Just one clear pick per category, 
            real flight alerts, and the packing system that lets you travel solo with 
            just a carry-on.
          </p>
          <p className="about-text highlight">
            This is for solo travellers who want real deals, not marketing fluff.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
