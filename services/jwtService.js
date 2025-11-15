const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'suncore-secret-key',
    { expiresIn: '7d' }
  );
};

module.exports = { generateToken };
