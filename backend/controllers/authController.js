const mongoose = require("mongoose");
const User = require("../model/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

// import mongoose from "mongoose";
// import User from "../model/UserModel.js"; // Ensure to add .js
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import otpGenerator from "otp-generator";

//middleware
exports.getUser = async (req, res, next) => {
  const email = req.params.email || req.user?.email;
  console.log(email);
  // console.log("the email from get user is:", email);
  if (!email) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const user = await User.findOne({ email }).select("-password");
    // console.log(user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }
    req.user = user;
    // next();
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.log("error from getUser");
    return res.status(404).json({ success: false, message: "Server error" });
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const { email } = req.method == "GET" ? req.query : req.body;
    // console.log(email);
    // check the user existance
    let exist = await User.findOne({ email });
    if (!exist)
      return res
        .status(404)
        .send({ error: "Can't find User with this email address!" });
    next();
    // return res.status(200).send({ exist });
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
};

exports.getRegister = async (req, res) => {
  res.json("register route");
};

exports.postRegister = async (req, res) => {
  const user = req.body;

  if (!user.username || !user.email || !user.password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  //check existing username
  const existUsername = await User.findOne({ name: user.username });
  if (existUsername) {
    return res.status(400).json({
      success: false,
      message: "User with this username already exists",
    });
  }
  //check existing email
  const existEmail = await User.findOne({ email: user.email });
  if (existEmail) {
    return res.status(400).json({
      success: false,
      message: "This email address is already taken",
    });
  }

  //check if the fields are not empty
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = new User({
      ...user,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered succesfully",
      // user: newUser,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.postLogin = async (req, res) => {
  const user = req.body;
  try {
    if (!user.email || !user.password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }
    const validUser = await User.findOne({ email: user.email });
    if (!validUser) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid username or email" });
    }
    const isMatch = await bcrypt.compare(user.password, validUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Password" });
    }
    const payload = {
      userId: validUser._id,
      username: validUser.username,
      email: validUser.email,
    };
    req.session.userId = validUser._id;
    req.session.username = validUser.username;
    req.session.email = validUser.email;

    console.log(req.session);
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    req.session.token = token;
    console.log(token);
    return res.status(200).json({
      success: true,
      validUser,
      message: "Log in successful",
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = req.user;
    // console.log(user);
    const updatedUser = req.body;
    const { email } = req.params;
    // console.log("the user updating the user is" + user);
    // console.log(user._id);
    // console.log(req.params.id);

    if (user.email !== email && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this user.",
      });
    }

    if (updatedUser.email && updatedUser.email !== user.email) {
      const existingUser = await User.findOne({ email: updatedUser.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use. Please use a different email.",
        });
      }
      user.email = updatedUser.email;
    }
    user.profile = updatedUser.profile || user.profile;
    user.firstName = updatedUser.firstName || user.firstName;
    user.lastName = updatedUser.lastName || user.lastName;
    user.mobile = updatedUser.mobile || user.mobile;
    // user.email = updatedUser.email || user.email;
    user.address = updatedUser.address || user.address;
    user.role = updatedUser.role || user.role;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User updated successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

exports.generateOTP = async (req, res) => {
  // Check if the user is logged in by verifying the session
  const username = req.session.username;

  if (!username) {
    return res
      .status(401)
      .json({ success: false, message: "User not logged in" });
  }

  try {
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    req.session.OTP = otp; // Store OTP in session for later verification
    console.log("OTP generated:", req.session.OTP);

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(201)
      .json({ success: true, message: "OTP generated", code: otp, user });
  } catch (err) {
    console.log("Error generating OTP:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { code } = req.query;
  const sessionOTP = req.session.OTP;
  if (!sessionOTP) {
    return res
      .status(400)
      .json({ message: "OTP has expired or is not generated" });
  }
  console.log("req.session.otp " + req.session.OTP);
  console.log("code from query " + code);
  if (req.session.OTP === code) {
    // req.session.OTP = null;
    req.session.isOTPVerified = true;
    return res.status(201).json({ message: "Verificaiton succesful" });
  }
  return res.status(400).json({ message: "Invalid OTP" });
};

exports.resetPassword = async (req, res) => {
  try {
    const { username } = req.session;
    const { password } = req.body;

    if (!req.session.isOTPVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP required",
      });
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Username not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();
    req.session.OTP = null;
    req.session.isOTPVerified = false;
    console.log(user.password);
    return res
      .status(200)
      .json({ success: true, message: "Password updated succesfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

exports.getToken = async (req, res) => {
  if (req.session.token) {
    console.log(req.session.token);
    return res.status(200).json({ token: req.session.token });
  } else {
    console.log("No token!");
    return res.status(401).json({ message: "Unauthorized" });
  }
};
