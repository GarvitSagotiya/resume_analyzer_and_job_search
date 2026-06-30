import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axiosconfig';
import { gsap } from 'gsap';
import SearchBar from '../../components/SearchBar/SearchBar';
import JobCard from '../../components/JobCard/JobCard';

const Jobs = ({ resumeText }) => {
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const cardsContainerRef = useRef(null);

  // Fallback static cards when no resume analysis is injected yet
  const fallbackJobs = [
    { id: "f_1", company: "Google", title: "Frontend Engineer", role: "Frontend Engineer", location: "Bangalore", type: "Full Time", posted: "1 day ago", skills: ['React', 'TypeScript', 'UI Engineering'] },
    { id: "f_2", company: "Microsoft", title: "Software Developer", role: "Software Developer", location: "Hyderabad", type: "Hybrid", posted: "3 days ago", skills: ['JavaScript', 'Node.js', 'REST APIs'] },
    { id: "f_3", company: "Amazon", title: "SDE I", role: "SDE I", location: "Delhi NCR", type: "Full Time", posted: "5 days ago", skills: ['React', 'DSA', 'System Design'] },
  ];

  useEffect(() => {
    // Abort automatic AI lookups if the parent dashboard profile context is missing
    if (!resumeText) return;

    const fetchJobMatches = async () => {
      setLoading(true);
      try {
        const response = await api.post('/resume/match-jobs', { resumeText });
        setMatchedJobs(response.data.jobs);

        // ✨ GSAP Smooth Stagger Entry Sequence
        setTimeout(() => {
          gsap.fromTo(".job-card-wrapper", 
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.7, ease: "power3.out" }
          );
        }, 50);

      } catch (err) {
        console.error("Could not fetch AI job matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobMatches();
  }, [resumeText]);

  const handleSearch = (filters) => {
    console.log('Search filters:', filters);
  };

  // Switch display arrays based on active context authentication metrics
  const displayJobs = resumeText && matchedJobs.length > 0 ? matchedJobs : fallbackJobs;

  return (
    <section className="page-section">
      <div className="container py-5">
        
        {/* Header Search Dashboard Banner */}
        <div className="glass-panel p-4 p-md-5 mb-4 text-white">
          <span className="section-badge">Jobs</span>
          <h1 className="page-title mt-3">
            {resumeText ? "AI Tailored Openings for You" : "Explore matching opportunities"}
          </h1>
          <p className="page-text mt-3 mb-4 text-slate-300">
            {resumeText 
              ? "Gemini checked your structural resume profile tokens against available listings to compile these match rates." 
              : "Search jobs by title, skills, and location, then apply with confidence."
            }
          </p>

          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Core Processing Overlay Spinner */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400 mx-auto mb-4"></div>
            <p className="animate-pulse text-sm">Analyzing tech stack alignment vectors...</p>
          </div>
        ) : (
          /* Grid Container Wrapper System */
          <div ref={cardsContainerRef} className="row g-4 mt-2">
            {displayJobs.map((job) => (
              <div key={job.id || job.jobId} className="col-md-6 col-lg-4 job-card-wrapper">
                <JobCard
                  company={job.company}
                  role={job.title || job.role}
                  location={job.location || "Remote"}
                  type={job.type || "Full Time"}
                  posted={job.posted || "Just Now"}
                  skills={job.skills || ['React', 'Node.js', 'TailwindCSS']}
                  
                  // Injected dynamic parameters read cleanly by JobCard if available
                  matchPercentage={job.matchPercentage}
                  matchReason={job.matchReason}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Jobs;