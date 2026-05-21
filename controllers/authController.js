import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ===============================
// REGISTER USER
// ===============================
export const registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      photoURL,
    } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // email exists check
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      photoURL,
    });

    // save user
    await newUser.save();

    // response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===============================
// LOGIN USER
// ===============================
export const loginUser = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // find user
    const user = await User.findOne({ email });

    // user not found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // password check
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    // wrong password
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // generate jwt token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // save token in cookie
    res.cookie("token", token, {
      httpOnly: true,

      // 🔥 VERY IMPORTANT FOR VERCEL
      secure: process.env.NODE_ENV === "production",

      // 🔥 VERY IMPORTANT FOR FRONTEND + BACKEND DIFFERENT DOMAIN
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // success response
    res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===============================
// LOGOUT USER
// ===============================
export const logoutUser = async (req, res) => {
  try {

    // clear cookie
    res.clearCookie("token", {
      httpOnly: true,

      // 🔥 SAME SETTINGS MUST MATCH LOGIN COOKIE
      secure: process.env.NODE_ENV === "production",

      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    });

    // response
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
