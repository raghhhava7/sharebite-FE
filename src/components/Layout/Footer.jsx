import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="footer-icon">🍽️</span>
              ShareBite
            </h3>
            <p className="footer-description">
              Reducing food waste by connecting donors, receivers, and volunteers 
              in a sustainable food redistribution platform.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">For Users</h4>
            <ul className="footer-links">
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">Sign Up</a></li>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Connect</h4>
            <div className="footer-social">
              <a href="#" className="social-link">📧 Email</a>
              <a href="#" className="social-link">📱 Twitter</a>
              <a href="#" className="social-link">📘 Facebook</a>
              <a href="#" className="social-link">💼 LinkedIn</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 ShareBite. All rights reserved.</p>
            <p className="footer-tagline">
              Together, we can make a difference in reducing food waste.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;