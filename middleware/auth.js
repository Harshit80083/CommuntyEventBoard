const jwt = require('jsonwebtoken');

// check if user is authenticated
function authMiddleware(req, res, next) {
  try {
    // get token from header
    let token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ error: 'no token provided' });
    }
    
    // remove "Bearer " prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }
    
    // verify token
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('token verification error', err);
    res.status(401).json({ error: 'invalid token' });
  }
}

// check if user is admin
function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'admin access required' });
  }
  next();
}

module.exports = {
  authMiddleware: authMiddleware,
  adminMiddleware: adminMiddleware
};
