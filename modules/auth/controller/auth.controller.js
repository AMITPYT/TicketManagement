const { userService } = require("../services");


async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const user = await userService.loginUser(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
}

async function getUser(req, res) {
  try {
    const users = await userService.getUser();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function requestPasswordReset(req, res, next) {
  try {
      const result = await userService.requestPasswordReset(req.body);
      res.json(result);
  } catch (error) {
      next(error);
  }
}

async function verifyOTPAndResetPassword(req, res, next) {
  try {
      const result = await userService.verifyOTPAndResetPassword(req.body);
      res.json(result);
  } catch (error) {
      next(error);
  }
}


module.exports = { createUser, loginUser, getUser, requestPasswordReset, verifyOTPAndResetPassword };