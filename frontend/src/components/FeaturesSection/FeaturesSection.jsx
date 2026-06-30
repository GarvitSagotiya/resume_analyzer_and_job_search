import React, { useRef } from 'react';
import './FeaturesSection.css';
import { FiFileText, FiTrendingUp, FiBriefcase } from 'react-icons/fi';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const featureItems = [
  {
    icon: <FiFileText />,
    title: 'ATS Resume Score',
    text: 'Analyze formatting, keywords, and resume strength with AI-powered scoring.',
  },
  {
    icon: <FiTrendingUp />,
    title: 'Skill Gap Insights',
    text: 'Identify missing skills for target roles and improve your chances faster.',
  },
  {
    icon: <FiBriefcase />,
    title: 'Smart Job Search',
    text: 'Match your profile with relevant openings and discover better job opportunities.',
  },
];

const FeaturesSection = () => {
  const sectionRef = useRef();

  useGSAP(
    () => {
      gsap.from('.features-heading', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from('.feature-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="features-section">
      <div className="container">
        <div className="features-heading text-center">
          <span className="section-badge">Core Features</span>
          <h2 className="section-title mt-3">Everything needed for smarter applications</h2>
          <p className="section-text mt-3">
            Build a polished career workflow with resume scoring, AI suggestions,
            skill analysis, and intelligent job discovery.
          </p>
        </div>

        <div className="row g-4 mt-4 features-grid">
          {featureItems.map((item, index) => (
            <div key={index} className="col-md-4">
              <div className="feature-card h-100">
                <div className="feature-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;