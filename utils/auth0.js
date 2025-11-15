const axios = require('axios');

const getUserInfoFromAuth0 = async (accessToken) => {
  try {
    const res = await axios.get('https://dev-3av5jmuks2abs1jk.us.auth0.com/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(res.data, 'all userInfo data==');
    return res.data; // contains name, nickname, email, picture, sub
  } catch (err) {
    console.error('Error fetching user info from Auth0:', err.response?.data || err.message);
    return null;
  }
};
module.exports = { getUserInfoFromAuth0 };
