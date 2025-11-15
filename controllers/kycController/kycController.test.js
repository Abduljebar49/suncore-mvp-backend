jest.setTimeout(30000); // Increase timeout for async operations

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../../app');
const User = require('../../models/User');

// Mock Auth0 RS256 access token decoding
jest.mock('express-oauth2-jwt-bearer', () => ({
  auth: () => (req, res, next) => {
    req.auth = {
      payload: {
        sub: 'auth0|testuser123',
      },
    };
    next();
  },
}));

let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  await User.create({
    auth0Id: 'auth0|testuser123',
    email: 'test@example.com',
    kycStatus: 'pending',
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('GET /api/v1/kyc/status', () => {
  it('should return the correct KYC status and email', async () => {
    const res = await request(app).get('/api/v1/kyc/status');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: 'success',
      data: {
        status: 'pending',
        email: 'test@example.com',
      },
    });
  });

  it('should return unknown status and null email if user not found', async () => {
    await User.deleteMany({ auth0Id: 'auth0|testuser123' });

    const res = await request(app).get('/api/v1/kyc/status');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: 'success',
      data: {
        status: 'unknown',
        email: null,
      },
    });
  });
});
