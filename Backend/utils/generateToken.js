const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'codevault_developer_secret_key_2026_xyz';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d'
  });
};

module.exports = generateToken;

