const User = require('../models/User');
const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: 'https://api.suncore.app', // must match Auth0 API identifier and the audience used by the frontend when requesting tokens
  issuerBaseURL: 'https://dev-3av5jmuks2abs1jk.us.auth0.com/', //tenant
  tokenSigningAlg: 'RS256',
});

// Custom admin check using DB role

const adminAuth = [
  checkJwt,
  async (req, res, next) => {
    try {
      // console.log('Decoded JWT payload:===', req.auth?.payload);
      const auth0Id = req.auth?.payload?.sub;
      if (!auth0Id) {
        return res.status(401).json({ message: 'Missing Auth0 ID' });
      }

      const user = await User.findOne({ auth0Id });

      if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Admin check failed:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

module.exports = {
  checkJwt,
  adminAuth,
};
