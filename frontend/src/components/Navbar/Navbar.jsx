import React, { useRef } from 'react';
import './Navbar.css';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiBriefcase, FiHome, FiLogIn, FiLayout, FiUser } from 'react-icons/fi';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
  const navRef = useRef();
  const location = useLocation();

  useGSAP(
    () => {
      gsap.from('.navbar-glass', {
        y: -30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    },
    { scope: navRef, dependencies: [location.pathname] }
  );

  return (
    <header ref={navRef} className="navbar-wrapper">
      <nav className="navbar navbar-expand-lg navbar-dark navbar-glass">
        <div className="container">
          <Link className="navbar-brand brand-logo" to="/">
            <span className="brand-icon">AI</span>
            <span className="brand-text">Resume Analyzer</span>
          </Link>

          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <NavLink to="/" className="nav-link nav-pill">
                  <FiHome />
                  <span>Home</span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/dashboard" className="nav-link nav-pill">
                  <FiLayout />
                  <span>Dashboard</span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/jobs" className="nav-link nav-pill">
                  <FiBriefcase />
                  <span>Jobs</span>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/login" className="nav-link nav-pill">
                  <FiLogIn />
                  <span>Login</span>
                </NavLink>
              </li>

              <li className="nav-item ms-lg-2">
                <button className="btn profile-btn">
                  <FiUser />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;