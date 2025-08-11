const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Get the actual token
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret
    req.user = decoded; // Attach decoded user info
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}