import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      // Navigate to home first, then scroll
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle scroll after navigation
  useEffect(() => {
    if (location.state && (location.state as { scrollTo?: string }).scrollTo) {
      const id = (location.state as { scrollTo: string }).scrollTo;
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">BigFlightDeals</span>
        </Link>
        <nav className="nav">
          <Link to="/destinations" className="nav-link nav-link-route">
            Destinations
          </Link>
          <Link to="/routes" className="nav-link nav-link-route">
            Routes
          </Link>
          <button onClick={() => scrollToSection('mission-input')} className="nav-link">
            Mission
          </button>
          <button onClick={() => scrollToSection('deals')} className="nav-link">
            Deals
          </button>
          <button onClick={() => scrollToSection('flight-widget')} className="nav-link">
            Search
          </button>
          <button onClick={() => scrollToSection('about')} className="nav-link">
            About
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
