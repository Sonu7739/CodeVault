const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const Snippet = require('../models/Snippet');
const Bookmark = require('../models/Bookmark');

test('Token Generator creates valid signed JWT token', () => {
  process.env.JWT_SECRET = 'test_secret_key_123';
  const fakeUserId = '64e8c1875323a6f9589d901a';
  const token = generateToken(fakeUserId);

  assert.ok(token, 'Token should be defined');
  const decoded = jwt.verify(token, 'test_secret_key_123');
  assert.equal(decoded.id, fakeUserId);
});

test('User schema password toJSON excludes password', async () => {
  const user = new User({
    username: 'testdeveloper',
    email: 'test@codevault.dev',
    password: 'password123'
  });

  const json = user.toJSON();
  assert.equal(json.password, undefined, 'Password must not be exposed in JSON output');
  assert.equal(json.username, 'testdeveloper');
  assert.equal(json.email, 'test@codevault.dev');
});

test('User matchPassword compares hashed passwords correctly', async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('secretPass99', salt);

  const user = new User({
    username: 'cryptodev',
    email: 'crypto@codevault.dev',
    password: hashedPassword
  });

  const isMatch = await user.matchPassword('secretPass99');
  assert.equal(isMatch, true, 'Correct password should match');

  const isWrong = await user.matchPassword('wrongPassword');
  assert.equal(isWrong, false, 'Incorrect password should fail');
});

test('Snippet schema validates required fields', () => {
  const snippet = new Snippet({});
  const err = snippet.validateSync();

  assert.ok(err, 'Validation should fail when required fields are missing');
  assert.ok(err.errors.title, 'Title is required');
  assert.ok(err.errors.code, 'Code is required');
  assert.ok(err.errors.language, 'Language is required');
  assert.ok(err.errors.userId, 'UserId is required');
});

test('Snippet schema accepts supported language and defaults visibility to public', () => {
  const snippet = new Snippet({
    title: 'Python QuickSort',
    description: 'In-place sorting algorithm',
    code: 'def quicksort(arr): ...',
    language: 'Python',
    userId: '64e8c1875323a6f9589d901a',
    tags: ['python', 'algorithms']
  });

  const err = snippet.validateSync();
  assert.equal(err, undefined, 'Snippet with valid parameters should pass validation');
  assert.equal(snippet.visibility, 'public');
  assert.equal(snippet.language, 'Python');
});

test('Bookmark schema requires userId and snippetId', () => {
  const bookmark = new Bookmark({});
  const err = bookmark.validateSync();

  assert.ok(err, 'Validation should fail when required fields are missing');
  assert.ok(err.errors.userId, 'UserId is required');
  assert.ok(err.errors.snippetId, 'SnippetId is required');
});

