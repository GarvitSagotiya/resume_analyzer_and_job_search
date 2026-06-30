const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract text from various file types
 * @param {Buffer} fileBuffer - File content as buffer
 * @param {string} filename - Original filename
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromFile = async (fileBuffer, filename) => {
  const ext = path.extname(filename).toLowerCase();

  try {
    if (ext === '.pdf') {
      // Parse PDF
      const pdfData = await pdfParse(fileBuffer);
      return pdfData.text || '';
    } else if (ext === '.docx') {
      // Parse DOCX
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value || '';
    } else if (ext === '.doc') {
      // For .doc files, we'll try to extract as text or return error
      // .doc format is legacy and harder to parse - suggest DOCX instead
      throw new Error('.doc format not directly supported. Please convert to .docx');
    } else if (ext === '.txt') {
      // Parse TXT
      return fileBuffer.toString('utf-8');
    } else {
      // Try to read as text by default
      return fileBuffer.toString('utf-8');
    }
  } catch (error) {
    console.error(`Error parsing ${ext} file:`, error.message);
    throw new Error(`Failed to parse ${ext} file: ${error.message}`);
  }
};

/**
 * Validate file before processing
 * @param {Object} file - File object with size and mimetype
 * @param {string} filename - Filename
 * @returns {Object} Validation result
 */
const validateFile = (file, filename) => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];
  const ALLOWED_MIMES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
  ];

  const ext = path.extname(filename).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
};

module.exports = {
  extractTextFromFile,
  validateFile,
};
