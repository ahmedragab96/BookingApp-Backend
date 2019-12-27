const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    if (!authHeader || !token || token === '') {
      req.isAuthorized = false;
      next();
    }
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
    if (!decoded) {
      req.isAuthorized = false;
      next();
    }
    req.isAuthorized = true;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (error) {
    req.isAuthorized = false;
    next();
  }
};

module.exports = {
  verifyToken,
}