import React, { useState, useRef, useEffect } from "react";
import { FiUploadCloud, FiFileText, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import api from "../../api/axiosconfig"; // Uses your secure, intercepted network layer
import "./ResumeUpload.css";

const ResumeUpload = ({ onAnalysisComplete }) => {
  const uploadRef = useRef();
  const inputRef = useRef();
  const loadingRef = useRef();
  const uploadCardRef = useRef();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Clean GSAP Entrance Animation using the modern useGSAP layout hook
  useGSAP(
    () => {
      gsap.from(uploadCardRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    },
    { scope: uploadRef }
  );

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  // Preserved your custom window event listener hook for external browse bindings
  useEffect(() => {
    const handleExternalBrowse = () => {
      inputRef.current?.click();
    };

    window.addEventListener("browseResume", handleExternalBrowse);
    return () => window.removeEventListener("browseResume", handleExternalBrowse);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrorMessage("");
    }
  };

  const handleUploadAndAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a resume file to upload.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    // ✨ Interactive GSAP Effects during AI active execution states
    gsap.to(uploadCardRef.current, { opacity: 0.5, scale: 0.98, duration: 0.3 });
    gsap.fromTo(loadingRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 });

    // Compile dynamic multipart data keys
    const formData = new FormData();
    formData.append("resume", file); // Targets backend middleware: upload.single("resume")
    if (jobDescription.trim()) {
      formData.append("jobDescription", jobDescription.trim());
    } else {
      formData.append("jobDescription", "General Full Stack Software Engineering Role");
    }

    try {
      const response = await api.post("/resume/analyze-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Lift structured Gemini analysis output data straight up to Dashboard.jsx state
      if (response.data.success && onAnalysisComplete) {
        onAnalysisComplete(response.data.data);
      }
    } catch (err) {
      console.error("AI Analysis error:", err);

      // Gracefully restore visual frame states if an error drops
      gsap.to(uploadCardRef.current, { opacity: 1, scale: 1, duration: 0.3 });

      if (err.response?.status === 503) {
        setErrorMessage("⚠️ Service is not available. Please ensure the backend server is operational.");
      } else if (err.response?.status === 504) {
        setErrorMessage("⏱️ Analysis took too long. Please shorten your parameters and try again.");
      } else {
        setErrorMessage(err.response?.data?.message || "An unexpected error occurred during AI processing.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={uploadRef} className="resume-upload-section">
      <div className="container">
        <div ref={uploadCardRef} className="upload-card">
          
          {/* Error Feedback Display */}
          {errorMessage && (
            <div className="error-message">
              <FiAlertCircle />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="upload-icon">
            <FiUploadCloud />
          </div>

          <h2>Upload Your Resume</h2>
          <p>
            Drag and drop your resume or browse from your device to begin resume
            analysis using our secure Gemini AI backend infrastructure.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            hidden
          />

          <div className="upload-actions">
            <button type="button" className="btn btn-primary upload-btn" onClick={handleBrowse}>
              Browse Resume
            </button>
          </div>

          <div className="file-support">
            <span><FiFileText /> PDF, DOC, DOCX, TXT supported (Max 10MB)</span>
          </div>

          {/* Conditional Input Selection States */}
          {file && (
            <div className="selected-file-info">
              <FiCheckCircle />
              <span>{file.name}</span>
            </div>
          )}

          {file && (
            <form onSubmit={handleUploadAndAnalyze} className="w-full mt-6 space-y-4 text-left">
              <div className="job-description-section">
                <label htmlFor="jobDesc" className="block text-sm font-medium text-slate-300 mb-2">
                  <strong>Optional:</strong> Paste your target job description for explicit ATS compatibility matching
                </label>
                <textarea
                  id="jobDesc"
                  placeholder="Paste the job requirements description text here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows="5"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500 transition"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary analyze-btn w-full"
                disabled={loading}
              >
                {loading ? "Analyzing Resume..." : "Analyze with Gemini AI"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Persistent Backdrop Loading Screen Overlay */}
      {loading && (
        <div ref={loadingRef} className="loading-overlay">
          <div className="spinner"></div>
          <p className="animate-pulse text-teal-400 font-semibold mt-4 tracking-wide text-sm">
            Gemini AI is parsing structural elements & generating optimization recommendations...
          </p>
        </div>
      )}
    </section>
  );
};

export default ResumeUpload;