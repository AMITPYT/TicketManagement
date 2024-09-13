
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const User = require('../../../models/auth');
const Otp = require('../../../models/otp');
const JWT_SECRET = 'Amitisagoodb$oy';

async function createUser(body) {
    try {
      const { name, email, password, type } = body;
      console.log("Received user data:", name, email); 
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed password:", hashedPassword); 
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        type,
      });
      console.log("User created:", user);
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { success: true, message: "User created", token };
    } catch (error) {
      console.error("Error while creating user:", error); 
      throw new Error("Error while creating user");
    }
  }
  

async function loginUser(body) {
  try {
    const { email, password } = body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    return { success: true, message: "User logged in", token };
  } catch (error) {
    throw new Error("Error while logging in");
  }
}

async function getUser() {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error("Error while fetching users");
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); 
}

async function saveOTP(email, otp) {
  await Otp.create({
      email,
      otp
  });
}

async function requestPasswordReset(body) {
  try {
      const { email } = body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
          throw new Error("User not found");
      }
      
      const otp = generateOTP();
      await saveOTP(email, otp);

      return { success: true, message: "OTP sent for password reset" };
  } catch (error) {
      throw new Error("Error while requesting password reset");
  }
}

async function verifyOTPAndResetPassword(body) {
  try {
      const { email, otp, newPassword } = body;
      

      const savedOTP = await Otp.findOne({ where: { email, otp } });
      if (!savedOTP) {
          throw new Error("Invalid OTP");
      }

         const currentTime = new Date();
         const otpTimestamp = new Date(savedOTP.createdAt);
         const timeDifference = currentTime - otpTimestamp;
         const otpExpirationTime = 2 * 60 * 1000;
         if (timeDifference > otpExpirationTime) {
             throw new Error("OTP expired");
         }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await User.findOne({ where: { email } });
      if (!user) {
          throw new Error("User not found");
      }
      user.password = hashedPassword;
      await user.save();
      await savedOTP.destroy();

      return { success: true, message: "Password reset successfully" };
  } catch (error) {
      throw new Error("Error while resetting password");
  }
}


module.exports = { createUser, loginUser, getUser, requestPasswordReset, verifyOTPAndResetPassword };