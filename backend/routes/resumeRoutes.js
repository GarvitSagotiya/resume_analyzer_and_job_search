const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  analyzeResume, 
  analyzeResumeFile,
  matchJobsWithAI // Pulled in your new Gemini job matching controller
} = require('../controllers/resumeController');

// ======================================
// MULTIPART/FORM-DATA CONFIGURATION
// ======================================

// Configure multer buffer strategies for clean, lightning-fast in-memory processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Strict 10MB data constraint cap
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];
    const allowedExtensions = [".pdf", ".docx", ".doc", ".txt"];

    const originalName = file.originalname.toLowerCase();
    const hasValidExtension = allowedExtensions.some((ext) =>
      originalName.endsWith(ext)
    );

    if (hasValidExtension || allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed."
        )
      );
    }
  },
});

// ======================================
// RESUME INTERACTIVE AI ROUTE MAPS
// ======================================

// @route   POST /api/resume/analyze
// @desc    Analyze raw plain text copy-pasted string metadata profiles
router.post('/analyze', analyzeResume);

// @route   POST /api/resume/analyze-file
// @desc    Analyze physical binary document assets (Multipart Form-Data stream upload)
router.post('/analyze-file', upload.single('resume'), analyzeResumeFile);


// @route   POST /api/resume/match-jobs
// @desc    Compare resume text against available jobs database using Gemini AI
router.post('/match-jobs', matchJobsWithAI);

module.exports = router;