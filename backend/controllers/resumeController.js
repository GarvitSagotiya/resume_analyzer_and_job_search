const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
require('dotenv').config(); // 1. Ensure env variables are loaded right here

// 2. Explicitly pass the API key object to prevent the 'undefined' crash
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ========================================================
// 1. RESUME ATS SCORE ANALYSIS CONTROLLER
// ========================================================
// @desc    Analyze Resume & Generate ATS Metrics
// @route   POST /api/resume/analyze
const analyzeResume = async (req, res) => {
  try {
    const { resumeText, targetJobDescription } = req.body;

    if (!resumeText) {
      return res.status(400).json({ success: false, message: "No resume content provided." });
    }

    // Construct a structured system prompt forcing JSON output
    const systemInstruction = `
      You are an expert ATS (Applicant Tracking System) optimization algorithm and professional resume reviewer.
      Analyze the provided resume text against the target job description (if provided). 
      You must respond ONLY with a valid JSON object matching this exact structure:
      {
        "atsScore": 85, 
        "summary": "Brief analysis overview sentence...",
        "missingKeywords": ["Keyword1", "Keyword2"],
        "criticalFixes": [
          { "category": "Formatting", "issue": "Problem description", "suggestion": "How to fix it" }
        ],
        "strengths": ["Strength 1", "Strength 2"],
        "tailoredSummarySuggestion": "AI optimized professional summary text..."
      }
    `;

    const userPrompt = `
      RESUME TEXT:
      ${resumeText}

      TARGET JOB DESCRIPTION (Optional):
      ${targetJobDescription || "General Full-Stack Web Developer Role"}
    `;

    // Call Gemini using the recommended model for text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2, // Low temperature for consistent, analytical responses
      }
    });

    // Parse the clean JSON response natively provided by Gemini
    const analysisData = JSON.parse(response.text);

    res.status(200).json({
      success: true,
      data: analysisData
    });

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    res.status(500).json({
      success: false,
      message: "AI Analysis failed.",
      error: error.message
    });
  }
};

const analyzeResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // 1. Extract text from the uploaded file buffer
    // (Replace this with your actual fileParser logic if you have one!)
    const fileBuffer = req.file.buffer;
    const resumeText = fileBuffer.toString('utf-8'); 

    // 2. You can then pass this resumeText to Gemini just like in analyzeResume
    // ... (Your Gemini analysis logic here) ...
    
    res.status(200).json({ success: true, message: "File parsed successfully", data: {} });
  } catch (error) {
    console.error("File Analysis Error:", error);
    res.status(500).json({ success: false, message: "Failed to process file." });
  }
};

// ========================================================
// 2. JOB MATCHING & RANKING CONTROLLER
// ========================================================
// @desc    Match Resume against Database Jobs using Gemini AI
// @route   POST /api/resume/match-jobs
const matchJobsWithAI = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ success: false, message: "No resume text provided for matching." });
    }

    // Fetch available jobs from your database 
    // (Mocking an array here, but replace this with your actual Mongoose query: await Job.find({}))
    const availableJobs = [
      { id: "job_1", title: "Frontend React Developer", company: "TechCorp", description: "Looking for a developer skilled in React, TailwindCSS, and animation libraries like GSAP." },
      { id: "job_2", title: "Backend Node.js Engineer", company: "DataSystems", description: "Seeking an engineer to build secure REST APIs using Express, MongoDB, and JWT authentication pipelines." },
      { id: "job_3", title: "Full Stack Web Developer", company: "CloudInnovations", description: "Requires React frontend experience, Node.js backend development, and integrating LLMs/AI APIs." },
      { id: "job_4", title: "Python Data Scientist", company: "AI Labs", description: "Experience with machine learning models, pandas, NumPy, and training datasets." }
    ];

    // Build the structural prompt forcing a ranked JSON array back
    const systemInstruction = `
      You are a precise corporate recruitment matching engine.
      Compare the user's resume against the provided array of available jobs.
      Select and rank the TOP 3 best job matches based on skill overlap.
      Provide a match percentage (0 to 100) and a brief 1-sentence reason why they match.
      
      You must respond ONLY with a valid JSON array matching this exact structure:
      [
        {
          "jobId": "job_id_string",
          "matchPercentage": 92,
          "matchReason": "Your extensive experience with React and GSAP perfectly aligns with their core tech stack requirements."
        }
      ]
    `;

    const userPrompt = `
      RESUME DATA:
      ${resumeText}

      AVAILABLE JOBS LIST:
      ${JSON.stringify(availableJobs)}
    `;

    // Call Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.1, // Low variance for stricter algorithmic matching
      }
    });

    const standardMatches = JSON.parse(response.text);

    // Map the AI scores back to the original full job details from the database
    const finalRankedJobs = standardMatches.map(match => {
      const fullJobDetails = availableJobs.find(job => job.id === match.jobId);
      return {
        ...fullJobDetails,
        matchPercentage: match.matchPercentage,
        matchReason: match.matchReason
      };
    });

    res.status(200).json({
      success: true,
      jobs: finalRankedJobs
    });

  } catch (error) {
    console.error("Job Matching Error:", error);
    res.status(500).json({ success: false, message: "Failed to process job matching.", error: error.message });
  }
};

// ========================================================
// MODULE EXPORTS
// ========================================================
module.exports = {
  analyzeResume,
  matchJobsWithAI,
  analyzeResumeFile
};