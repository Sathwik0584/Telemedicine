// const jwt = require('jsonwebtoken');
// const Patient = require('../models/patient');
// const Doctor = require('../models/doctor');
// require('dotenv').config();

// // Middleware to authenticate JWT
// const authenticateJWT = (req, res, next) => {
//   const token = req.header('Authorization');
  
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token.replace('Bearer ', ''), 'Sathwik2004@');
//     if(decoded.role === "doctor"){
//       req.user = Doctor.findOne({_id : decoded.id});
//     }else{
//       req.user = Patient.findOne({_id : decoded.id});
//     }
//      // Attach user data to request
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };

// // Middleware to authorize roles
// const authorizeRole = (roles) => {
//   return (req, res, next) => {
//     console.log("User role:", req.user.role); // Debugging
//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({ msg: 'Access forbidden: Insufficient role' });
//     }
//     next();
//   };
// };


// module.exports = { authenticateJWT, authorizeRole };
