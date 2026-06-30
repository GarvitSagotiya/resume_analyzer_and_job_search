import React from 'react';
import './JobCard.css';
import { FiBookmark, FiBriefcase, FiMapPin, FiClock } from 'react-icons/fi';

const JobCard = ({
  company = 'TechNova',
  role = 'Frontend Developer',
  location = 'Remote',
  type = 'Full Time',
  posted = '2 days ago',
  skills = ['React', 'JavaScript', 'Bootstrap'],
}) => {
  return (
    <div className="job-card">
      <div className="job-card-top">
        <div>
          <span className="job-company">{company}</span>
          <h3 className="job-role">{role}</h3>
        </div>

        <button className="bookmark-btn">
          <FiBookmark />
        </button>
      </div>

      <div className="job-meta">
        <span><FiMapPin /> {location}</span>
        <span><FiBriefcase /> {type}</span>
        <span><FiClock /> {posted}</span>
      </div>

      <div className="job-skills">
        {skills.map((skill, index) => (
          <span key={index}>{skill}</span>
        ))}
      </div>

      <div className="job-actions">
        <button className="btn btn-outline-light">View Details</button>
        <button className="btn btn-primary">Apply Now</button>
      </div>
    </div>
  );
};

export default JobCard;