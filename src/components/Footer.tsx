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
            <a href="/guides/toronto-to-bangkok.html" className="footer-link">Toronto to Bangkok guide</a>
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
