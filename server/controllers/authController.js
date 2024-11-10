const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');
const mongoose = require('mongoose');
const User = require('../models/User');
const nodemailer = require("nodemailer");
const EmailVerificationToken = require("../models/EmailVerificationToken");
const moment = require('moment-timezone');
// const {validationResult} = require('express-validator');
const { isEmail, isStrongPassword  } = require('validator');

// Utility function to generate a 6-digit OTP
const generateOTP = () => {
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    const randomValue = Math.floor(Math.random() * 10); // Use Math.floor for integers
    OTP += randomValue;
  }
  console.log(OTP);
  return OTP;
};

// Register Controller
exports.register = async (req, res) => {
  const { email, password, name, selectUser } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ msg: 'User already exists and is verified' });
    }

    // Validate email and password
    if (!isEmail(email)) return res.status(400).json({ msg: 'Invalid email format' });
    if (!isStrongPassword(password, { minLength: 8 })) return res.status(400).json({ msg: 'Weak password' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (user) {
      // User exists, but is not verified, update the user's info
      user.password = hashedPassword;
      user.profile.name = name;
      user.role = selectUser;
      await user.save();
    } else {
      // New user registration
      user = new User({
        email,
        password: hashedPassword,
        role: selectUser,
        profile: { name }
      });
      await user.save();
    }

     // Continue with sending OTP for email verification
     const OTP = generateOTP();
     const emailVerificationToken = new EmailVerificationToken({
       owner: user._id,
       token: OTP,
     });
     await emailVerificationToken.save();

     // Configure nodemailer transport
     const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "145d3b86201376",
        pass: "0bfa6c5aa3e066"
      }
    });

    // Send OTP
    await transport.sendMail({
      from: "Rewear@gmail.com",
      to: user.email,
      subject: "Email Verification",
      html: `<p>Your verification OTP</p><h1>${OTP}</h1>`,
    });

    return res.status(200).json({ msg: "OTP sent. Please verify your email." });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// OTP Verification Controller method 
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the token record by user ID
    const tokenRecord = await EmailVerificationToken.findOne({ owner: user._id });
    if (!tokenRecord) return res.status(401).json({ message: "Invalid or expired OTP" });

    // Compare OTP with the hashed token in the database
    const isMatch = await bcrypt.compare(otp.trim(), tokenRecord.token);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid; delete the token and mark the user as verified
    await EmailVerificationToken.deleteOne({ _id: tokenRecord._id });
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Login controller method
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Incorrect Email' });
    }

    // Check if the user is verified
     // Check if the user is verified
     if (!user.isVerified) {
      return res.status(403).json({ message: 'Account not verified. Please verify your email.' });
    }
    // Check if the user
    else if (user.status === 'banned'){
      return res.status(400).json({ message: 'Account Banned' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    // Generate JWT token
    const token = jwt.sign({ user: { id: user._id, email: user.email, name: user.name, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while logging in' });
  }
};

// exports.google_login = async (req, res) => {
//   const { tokenId } = req.body;
//   const apiUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`;

//   try {
//     const response = await axios.post(apiUrl);
//     const { email, name } = response.data;

//     // Check if the user already exists in the database
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       // If the user exists, generate a new token and return it
//       const token = jwt.sign({ userId: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
//       res.json({ user: existingUser, token });
//     } else {
//       // If the user doesn't exist, create a new user document
//       const newUser = new User({
//         email,
//         profile: {
//           name,
//         },
//         role: 'buyer', // default role
//       });
//       await newUser.save();

//       // Generate a new token and return it
//       const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
//       res.json({ user: newUser, token });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: 'Invalid token ID' });
//   }
// };

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database connection error. Please try again later.' });
    }

    const blacklistedToken = new BlacklistedToken({token});

    // Use a 10-second timeout for saving the blacklisted token
    const saveWithTimeout = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server Connection Error'));
      }, 10000); // 10-second timeout

      blacklistedToken.save()
        .then(result => {
          clearTimeout(timeout);
          resolve(result);
        })
        .catch(err => {
          clearTimeout(timeout);
          reject(err);
        });
    });

    await saveWithTimeout;



    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during logout' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, addresses } = req.body;
    const userId = req.user.id;
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let parsedaddress = JSON.parse(addresses);

    let profilePicture = req.files && req.files.profilePicture ? req.files.profilePicture[0].filename : user.profile.profilePicture;
    let cnicfront = user.profile.cnicfront;
    let cnicback = user.profile.cnicback;

    // Only allow CNIC updates if the user is not verified
    if (user.status !== 'verified-active') {
      cnicfront = req.files && req.files.cnicfront ? req.files.cnicfront[0].filename : user.profile.cnicfront;
      cnicback = req.files && req.files.cnicback ? req.files.cnicback[0].filename : user.profile.cnicback;
    }

    // Proceed with updating the user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        'profile.name': name,
        'profile.email': email,
        'profile.phone': phone,
        'profile.addresses': parsedaddress,
        'profile.profilePicture': profilePicture,
        'profile.cnicfront': cnicfront,
        'profile.cnicback': cnicback,
        updatedAt: Date.now(),  
      },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'An error occurred while updating user profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from the authenticated request
    const { currentPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password is correct
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'New password must be different from the current password' });
    }

    // Validate the new password strength
    if (!isStrongPassword(newPassword, { minLength: 8 })) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;

    // Update updatedAt field
    user.updated_at = moment().tz('Asia/Karachi').toDate();

    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'An error occurred while changing the password' });
  }
};

exports.validateUser = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while validating the token' });
  }
};
