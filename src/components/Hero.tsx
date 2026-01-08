import { useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Stub: connect to MailerLite later
    alert('Stub: connect to MailerLite later.');
    setEmail('');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Solo flight deals + packing plans, on autopilot.
          </h1>
          <p className="hero-description">
            Stop scrolling through fake "$20 a day" itineraries. Get honest flight deals, 
            smart packing tips, and the exact tools I use to travel solo without breaking the bank.
          </p>
          
          <div className="hero-cta-buttons">
            <button 
              className="hero-primary-button"
              onClick={() => scrollToSection('flight-widget')}
            >
              Scan flights now
            </button>
            <button 
              className="hero-primary-button"
              onClick={() => scrollToSection('solo-planner')}
            >
              Get the Solo Travel Toolkit
            </button>
          </div>

          <form className="email-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="email-input"
            />
            <button type="submit" className="submit-button">
              Get cheap flights + packing tips
            </button>
          </form>
          
          <p className="form-note">
            Weekly deals + packing tips. No spam, unsubscribe anytime.
          </p>
        </div>

        <div className="example-trip-card">
          <div className="trip-header">
            <span className="trip-label">Example Trip</span>
            <span className="trip-price">$420</span>
          </div>
          <div className="trip-route">
            <span className="trip-city">Toronto</span>
            <span className="trip-arrow">→</span>
            <span className="trip-city">Lisbon</span>
          </div>
          <div className="trip-details">
            <div className="trip-detail-item">
              <span className="detail-label">Flight:</span>
              <span className="detail-value">$320 roundtrip</span>
            </div>
            <div className="trip-detail-item">
              <span className="detail-label">Packing:</span>
              <span className="detail-value">Carry-on only</span>
            </div>
            <div className="trip-detail-item">
              <span className="detail-label">Tools:</span>
              <span className="detail-value">eSIM + Insurance</span>
            </div>
            <div className="trip-detail-item">
              <span className="detail-label">Style:</span>
              <span className="detail-value">Solo, 7 days</span>
            </div>
          </div>
          <div className="trip-footer">
            Real deal window: March–May, September–November
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
