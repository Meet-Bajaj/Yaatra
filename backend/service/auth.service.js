const JWT = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const generateToken = (user) => {
  return JWT.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

