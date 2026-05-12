const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <div className="footer-brand">
        <a href="#" className="logo">ratio<span style={{ color: 'var(--accent)' }}>'d</span></a>
        <p className="footer-tagline">
          The modern standard for social polling. Drive engagement and
          uncover insights, effortlessly.
        </p>
      </div>

      <div className="footer-links">
        <div className="link-group">
          <h4>Platform</h4>
          <a href="#">Create a Poll</a>
          <a href="#">Trending</a>
          <a href="#">Analytics</a>
          <a href="#">Pricing</a>
        </div>
        <div className="link-group">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>
        <div className="link-group">
          <h4>Legal</h4>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <p className="footer-copy">© 2026 ratio'd Inc. All rights reserved.</p>
      <div className="footer-legal">
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="#">Cookies</a>
      </div>
    </div>
  </footer>
);

export default Footer;
