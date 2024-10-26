const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    // Allow requests without token to pass through if they are not accessing restricted routes
    return next();
  }

  try {
    // Check if the token is blacklisted
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token has been blacklisted' });
    }

    // Verify the token and extract user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Add this line for debugging

    req.user = decoded.user;
    req.userId = req.user._id;
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Add this line for debugging
    if (error.name === 'TokenExpiredError') {
      try {
        // Decode the token to get the expiration time
        const decoded = jwt.decode(token);

        // Blacklist the expired token
        const blacklistedToken = new BlacklistedToken({
          token,
          expiresAt: new Date(decoded.exp * 1000), // JWT expiration time
        });

        await blacklistedToken.save();
        console.log('Token has been blacklisted due to expiration'); // Add this line for debugging
        return res.status(401).json({ message: 'Token has expired' });

      } catch (blacklistError) {
        console.error('Error blacklisting token:', blacklistError); // Add this line for debugging
        return res.status(500).json({ message: 'An error occurred during token blacklisting' });
      }
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};
