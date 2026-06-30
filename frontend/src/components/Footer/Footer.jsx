import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3 className="footer-brand">Resume Analyzer</h3>
            <p className="footer-text">
              Modern AI-powered resume analysis and smart job discovery platform
              built for better career decisions.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Navigation</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/jobs">Jobs</Link>
              <Link to="/login">Login</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Connect</h4>
            <div className="footer-socials">
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <FiGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <FiLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FiTwitter />
              </a>
              <a href="mailto:hello@example.com">
                <FiMail />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Resume Analyzer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;