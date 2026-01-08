import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-copyright">
            © {currentYear} BigFlightDeals. All rights reserved.
          </div>
          <div className="footer-links">
            <button onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })} className="footer-link">Travel Tools</button>
            <button onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })} className="footer-link">Email list</button>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Instagram</a>
            <a href="#" className="footer-link">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
