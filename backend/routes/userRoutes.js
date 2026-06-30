const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  handleRefreshToken, 
  logoutUser,
  getUsers 
} = require('../controllers/userController');

// ======================================
// AUTHENTICATION & TOKEN ROTATION ROUTES
// ======================================

// @route   POST /api/users/register
router.post('/register', registerUser);

// @route   POST /api/users/login
router.post('/login', loginUser);

// @route   POST /api/users/refresh
router.post('/refresh', handleRefreshToken);

// @route   POST /api/users/logout
router.post('/logout', logoutUser);

// ======================================
// USER MANAGEMENT ROUTES
// ======================================

// @route   GET /api/users
router.get('/', getUsers);

module.exports = router;