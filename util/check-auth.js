const { AuthenticationError } = require('apollo-server-express');

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

module.exports = (context) => {
  // context = { ... headers }
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // Bearer ....
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const data = jwt.verify(token, SECRET_KEY);
        //console.log(data);
        return data;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error("Authentication token must have properly syntax");
  }
  throw new Error('Authorization header must be provided');
};
