const jwt = require('jsonwebtoken');
const JWT_SECRET =  process.env.JWT_SECRET; 

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1]; // First try cookies, then Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }


    
    req.user = decoded;
    next();  // Proceed to the next middleware or route handler
  });
};

module.exports = isAuthenticated;
