const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

//Replaced with Auth0
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'suncore-secret-key');

    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Check if user account is active
    if (user.status !== 'active' && user.status !== 'pending') {
      return res.status(403).json({ message: 'Account is not active' });
    }

    req.user = decoded;
    req.userDoc = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin authorization middleware
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
    });
  } catch (error) {
    logger.error('Admin auth error', { error });
    res.status(401).json({ message: 'Authorization failed' });
  }
};

module.exports = { auth, adminAuth };
