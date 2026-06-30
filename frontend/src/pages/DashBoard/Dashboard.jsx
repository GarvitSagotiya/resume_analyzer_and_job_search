import React, { useState } from 'react';
import ResumeUpload from '../../components/ResumeUpload/ResumeUpload';
import ResumeScore from '../../components/ResumeScore/ResumeScore';

const Dashboard = () => {
  // State hook to store the parsed response data payload returned from Gemini AI
  const [aiAnalysisData, setAiAnalysisData] = useState(null);

  return (
    <>
      {!aiAnalysisData ? (
        /* ========================================================
           STATE 1: INITIAL UPLOAD VIEW
           Rendered when the user hasn't uploaded a document session yet.
           ======================================================== */
        <ResumeUpload onAnalysisComplete={(data) => setAiAnalysisData(data)} />
      ) : (
        /* ========================================================
           STATE 2: AI ANALYTICS RESULTS VIEW
           Rendered seamlessly using GSAP staggering once tokens & parsing conclude.
           ======================================================== */
        <>
          <section className="page-section">
            <div className="container py-5">
              <div className="glass-panel p-4 p-md-5 text-white">
                <span className="section-badge">Dashboard</span>
                <h1 className="page-title mt-3">Resume analysis overview</h1>
                
                {/* Dynamic AI Analysis Overview Summary Statement Text */}
                <p className="page-text mt-3 text-slate-300">
                  {aiAnalysisData.summary || "Review ATS performance, improve weak sections, and monitor resume quality."}
                </p>

                {/* Quick Overall ATS Indicator Chip */}
                <div className="mt-4 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2 text-blue-400 font-semibold">
                  <span>Target Match Rating:</span>
                  <span className="text-xl font-bold">{aiAnalysisData.atsScore || 0}%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Pass the fully complete multi-tier data parameters to your metrics and chart render layer */}
          <ResumeScore analysisData={aiAnalysisData} />
        </>
      )}
    </>
  );
};

export default Dashboard;