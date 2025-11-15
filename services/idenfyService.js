//services/idenfyService.js
const axios = require('axios');
//DigitalOcean dev ulr
// const BASE_URL = process.env.BACKEND_DO_DEV_URL || 'http://localhost:8000';
const BACKEND_URL = process.env.BACKEND_DO_DEV_URL || 'http://localhost:8000';
// const BACKEND_URL = 'http://localhost:8000';

const startKYCSession = async ({
  clientId,
  firstName,
  lastName,
  documentType,
  documentNumber,
  dateOfBirth,
  address,
  country = 'us',
  verificationId,
}) => {
  const payload = {
    clientId,
    firstName,
    lastName,
    callbackUrl: `${BACKEND_URL}/api/v1/verify/webhooks/idenfy`,
    successUrl: `${BACKEND_URL}/api/v1/verify/webhooks/kyc/success?userId=${clientId}&scanRef=${verificationId}`,
    errorUrl: `${BACKEND_URL}/api/v1/verify/webhooks/kyc/error?userId=${clientId}&scanRef=${verificationId}`,
    locale: 'en',
    showInstructions: true,
    expiryTime: 86400,
    sessionLength: 1800,
    country,
    // documents: [documentType.toUpperCase()],
    documents: [documentType],
    dateOfBirth,
    address,
    documentNumber,
    tokenType: 'IDENTIFICATION',
  };

  const apiKey = process.env.IDENFY_API_KEY;
  const apiSecret = process.env.IDENFY_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('iDenfy API credentials are not set');
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  const { data } = await axios.post('https://ivs.idenfy.com/api/v2/token', payload, {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  });

  return {
    scanRef: data.scanRef,
    authToken: data.authToken,
    metadata: data,
  };
};

module.exports = {
  startKYCSession,
};
