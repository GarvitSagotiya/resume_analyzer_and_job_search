const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ======================================
// TOKEN GENERATION HELPERS
// ======================================

// Helper to generate access tokens (Short-lived)
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Helper to generate refresh tokens (Long-lived)
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// ======================================
// AUTH CONTROLLER ENDPOINTS
// ======================================

// @desc    Register user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Create user (Password hashing is handled natively by User model pre-save hook)
    const user = new User({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshTokens = [newRefreshToken];
    await user.save();

    // Set HttpOnly Cookie
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ 
      success: true,
      accessToken, 
      user: { id: user._id, name: user.name, email: user.email } 
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password here since it is set to select: false in the schema
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // If cookies contain an old token from an unlogged session, remove it from DB cleanly
    let newRefreshTokenArray = !req.cookies?.jwt 
      ? user.refreshTokens 
      : user.refreshTokens.filter(rt => rt !== req.cookies.jwt);

    user.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
    await user.save();

    // Set HttpOnly Cookie
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ 
      success: true,
      accessToken, 
      user: { id: user._id, name: user.name, email: user.email } 
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refresh Token Rotation Handler
// @route   POST /api/users/refresh
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const refreshToken = cookies.jwt;

  // Clear cookie immediately to prepare for the rotated new cookie
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' });

  const user = await User.findOne({ refreshTokens: refreshToken });

  // DETECTED REFRESH TOKEN REUSE (Malicious Hack Attempt)
  if (!user) {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return; // Expired token used illegally
      // Wipe ALL active refresh tokens for the compromised account
      const hackedUser = await User.findById(decoded.id);
      if (hackedUser) {
        hackedUser.refreshTokens = [];
        await hackedUser.save();
      }
    });
    return res.status(403).json({ success: false, message: 'Compromised reuse detected. All sessions terminated.' });
  }

  // Filter out the current used token from user list
  const newRefreshTokenArray = user.refreshTokens.filter(rt => rt !== refreshToken);

  // Evaluate token validity
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
    if (err) {
      user.refreshTokens = [...newRefreshTokenArray];
      await user.save();
      return res.status(403).json({ success: false, message: 'Refresh token expired' });
    }

    if (user._id.toString() !== decoded.id) return res.status(403).json({ success: false, message: 'Forbidden' });

    // Token is valid! Issue brand new access & refresh pairs
    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
    await user.save();

    // Assign new rotated refresh cookie
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ accessToken, user: { id: user._id, name: user.name, email: user.email } });
  });
};

// @desc    Logout user
// @route   POST /api/users/logout
const logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No cookie content to wipe
  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshTokens: refreshToken });
  if (user) {
    user.refreshTokens = user.refreshTokens.filter(rt => rt !== refreshToken);
    await user.save();
  }

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' });
  res.sendStatus(204);
};

// ======================================
// GENERAL USER SYSTEM MANAGEMENT
// ======================================

// @desc    Get Users
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  handleRefreshToken,
  logoutUser,
  getUsers,
};