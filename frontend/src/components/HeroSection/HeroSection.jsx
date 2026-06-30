import React, { useRef } from 'react';
import './HeroSection.css';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HeroSection = () => {
  const sectionRef = useRef();
  const cardRef = useRef();
  const navigate = useNavigate();

  useGSAP(
    () => {
      gsap.from(cardRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
      });

      gsap.from('.hero-title-line', {
        y: 45,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        delay: 0.15,
        ease: 'power3.out',
      });

      gsap.from('.hero-description', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        delay: 0.45,
        ease: 'power3.out',
      });

      gsap.from('.hero-buttons .btn', {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.6,
        ease: 'power3.out',
      });

      gsap.to('.floating-circle', {
        y: -30,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: 'sine.inOut',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="hero-section">
      <div className="floating-circle"></div>
      <div className="floating-circle floating-circle-two"></div>

      <div ref={cardRef} className="hero-card">
        <span className="hero-badge">AI Powered Career Toolkit</span>

        <h1 className="hero-heading">
          <span className="hero-title-line">Resume</span>
          <span className="hero-title-line">Analyzer</span>
        </h1>

        <p className="hero-description">
          Upload your resume, analyze ATS performance, discover skill gaps,
          and explore the best job opportunities using AI.
        </p>

        <div className="hero-buttons">
          <button
            className="btn btn-primary hero-btn-primary"
            onClick={() => {
              window.dispatchEvent(new Event('browseResume'));
            }}
          >
            Upload Resume
          </button>

          <button
            className="btn btn-outline-light hero-btn-secondary"
            onClick={() => navigate('/jobs')}
          >
            Explore Jobs
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;