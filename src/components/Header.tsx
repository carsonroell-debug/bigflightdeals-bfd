import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo" onClick={() => scrollToSection('hero')}>
          <span className="logo-text">BigFlightDeals</span>
        </div>
        <nav className="nav">
          <button onClick={() => scrollToSection('how-it-works')} className="nav-link">
            How it works
          </button>
          <button onClick={() => scrollToSection('tools')} className="nav-link">
            Travel Tools
          </button>
          <button onClick={() => scrollToSection('deals')} className="nav-link">
            Flight Deals
          </button>
          <button onClick={() => scrollToSection('flight-widget')} className="nav-link">
            Search Flights
          </button>
          <button onClick={() => scrollToSection('planner')} className="nav-link">
            Solo Planner
          </button>
          <button onClick={() => scrollToSection('about')} className="nav-link">
            About
          </button>
          <button onClick={() => scrollToSection('faq')} className="nav-link">
            FAQ
          </button>
        </nav>
        <button 
          className="cta-button"
          onClick={() => scrollToSection('hero')}
        >
          Get flight alerts
        </button>
      </div>
    </header>
  );
};

export default Header;
