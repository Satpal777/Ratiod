import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`navbar-wrapper ${scrolled ? 'nav-scrolled' : ''}`}>
      <nav className="navbar">
        <div className="logo">ratio'd</div>
        <div className="nav-links">
          <a href="#">Trending</a>
          <a href="#">How it Works</a>
        </div>
        <button className="btn btn-primary nav-btn">Sign In</button>
      </nav>
    </div>
  );
};

export default Navbar;
