const jwt = require('jsonwebtoken');
const secret = process.env.KEY_JWT || 'secret-key';
const option = {
  algorithm: process.env.JWT_ALGORITHM || 'HS256',
  expiresIn: process.env.JWT_EXPIRES_IN ? `${process.env.JWT_EXPIRES_IN}d` : '15d',
  issuer: process.env.JWT_ISSUER || 'phamtinh',
};

const generateToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, option, (error, token) => {
      if (error) {
        return reject(error);
      }
      resolve(token);
    });
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
