const User = require('../models/User');
const { getUserInfoFromAuth0 } = require('../utils/auth0.js');

const ensureUserExists = async (req, res, next) => {
  const { sub: auth0Id } = req.auth?.payload || {};
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!auth0Id) {
    return res.status(400).json({ error: 'Missing Auth0 ID' });
  }

  let user = await User.findOne({ auth0Id });

  if (!user) {
    if (process.env.NODE_ENV === 'test') {
      return next(); // Let controller handle missing user
    }

    const auth0User = await getUserInfoFromAuth0(accessToken);

    const email = auth0User?.name || `noemail-${Date.now()}@example.com`;
    // const name = auth0User?.nickname || 'User';

    user = await User.create({
      auth0Id,
      email,
      firstName: '',
      lastName: '',
      phone: '',
      role: 'CLIENT',
      status: 'PENDING',
      kycStatus: 'PENDING',
      preferences: {
        notifications: { email: true, sms: false, push: true },
        payoutFrequency: 'MONTHLY',
        currency: 'USD',
      },
      emailVerified: false,
      password: null,
    });

    console.log(`✅ New user created from Auth0: ${email}`);
  }

  req.user = user;
  next();
};

module.exports = ensureUserExists;
