import './Hero.css';

const Hero = () => (
  <section id="hero" className="hero">
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Travel smarter, starting with the flight.</h1>
        <p className="hero-description">
          Practical guides for independent travellers. Compare the whole trip, understand
          the tradeoffs, and find the options that work for you.
        </p>
        <div className="hero-cta-buttons">
          <a className="hero-primary-button" href="/guides/toronto-to-bangkok.html">
            Read the Toronto to Bangkok guide
          </a>
          <a className="hero-primary-button" href="#flight-widget">Search flights</a>
        </div>
        <p className="form-note">Flight prices change. Always check the final fare and terms before booking.</p>
      </div>
      <div className="example-trip-card">
        <div className="trip-header"><span className="trip-label">START HERE</span></div>
        <div className="trip-route"><span className="trip-city">Toronto</span><span className="trip-arrow">→</span><span className="trip-city">Bangkok</span></div>
        <div className="trip-details">
          <div className="trip-detail-item"><span className="detail-label">01</span><span className="detail-value">Compare fares and dates</span></div>
          <div className="trip-detail-item"><span className="detail-label">02</span><span className="detail-value">Check connections and baggage</span></div>
          <div className="trip-detail-item"><span className="detail-label">03</span><span className="detail-value">Plan your arrival</span></div>
        </div>
        <div className="trip-footer">A practical guide, without made-up deals.</div>
      </div>
    </div>
  </section>
);

export default Hero;
