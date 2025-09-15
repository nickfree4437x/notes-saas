const jwt = require('jsonwebtoken');

function authMiddleware(requiredRole = null) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // id, role, tenantId

      if (requiredRole && req.user.role !== requiredRole)
        return res.status(403).json({ message: 'Forbidden: insufficient role' });

      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
}

module.exports = authMiddleware;
