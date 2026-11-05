const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { registerUser, loginUser } = require('../controllers/authController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Helper to create mock response object
const createMockResponse = () => {
  const res = {};
  res.statusCode = 200;
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (data) {
    this.body = data;
    return this;
  };
  return res;
};

test('registerUser rejects missing fields with 400', async () => {
  const req = { body: { username: 'testuser' } };
  const res = createMockResponse();

  await registerUser(req, res, () => {});

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.ok(res.body.message.includes('Please provide username, email, and password'));
});

test('registerUser rejects mismatched passwords with 400', async () => {
  const req = {
    body: {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'differentPassword'
    }
  };
  const res = createMockResponse();

  await registerUser(req, res, () => {});

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.ok(res.body.message.includes('Passwords do not match'));
});

test('loginUser rejects missing email or password with 400', async () => {
  const req = { body: {} };
  const res = createMockResponse();

  await loginUser(req, res, () => {});

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.ok(res.body.message.includes('Please provide both email and password'));
});

test('protect middleware returns 401 when no token is provided in header', async () => {
  const req = { headers: {} };
  const res = createMockResponse();
  let nextCalled = false;

  await protect(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.success, false);
  assert.equal(nextCalled, false);
  assert.ok(res.body.message.includes('Not authorized, no token provided'));
});

test('protect middleware returns 401 on invalid token signature', async () => {
  const req = {
    headers: {
      authorization: 'Bearer an_invalid_jwt_token_string'
    }
  };
  const res = createMockResponse();
  let nextCalled = false;

  await protect(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.success, false);
  assert.equal(nextCalled, false);
  assert.ok(res.body.message.includes('Not authorized, token failed'));
});

test('optionalAuth continues with req.user = null when no authorization header exists', async () => {
  const req = { headers: {} };
  const res = createMockResponse();
  let nextCalled = false;

  await optionalAuth(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user, null);
});

