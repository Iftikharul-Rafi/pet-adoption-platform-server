import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import User from "../models/userModel.js";




// ===============================
// REGISTER USER
// ===============================
export const registerUser = async (req, res) => {

  try {

    // frontend থেকে data নিচ্ছি
    const {
      name,
      email,
      password,
      photoURL,
    } = req.body;





    // ===============================
    // VALIDATION
    // ===============================
    if (!name || !email || !password) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    }






    // ===============================
    // EMAIL EXISTS CHECK
    // ===============================
    const existingUser =
      await User.findOne({ email });




    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });

    }







    // ===============================
    // PASSWORD HASH
    // ===============================
    const hashedPassword =
      await bcrypt.hash(password, 10);








    // ===============================
    // CREATE USER
    // ===============================
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      photoURL,
    });








    // ===============================
    // SAVE USER
    // ===============================
    await newUser.save();








    // ===============================
    // RESPONSE
    // ===============================
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






    // ===============================
    // VALIDATION
    // ===============================
    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });

    }







    // ===============================
    // FIND USER
    // ===============================
    const user =
      await User.findOne({ email });







    // ===============================
    // USER NOT FOUND
    // ===============================
    if (!user) {

      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });

    }








    // ===============================
    // PASSWORD MATCH CHECK
    // ===============================
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );







    // ===============================
    // WRONG PASSWORD
    // ===============================
    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });

    }








    // ===============================
    // JWT TOKEN GENERATE
    // ===============================
    const token = jwt.sign(
      {
        id: user._id,

        // 🔥 ADD THESE
        name: user.name,

        email: user.email,

        photoURL: user.photoURL,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );








    // ===============================
    // SAVE TOKEN IN COOKIE
    // ===============================
    res.cookie("token", token, {

      httpOnly: true,

      secure: false,

      sameSite: "lax",

      maxAge:
        7 * 24 * 60 * 60 * 1000,

    });








    // ===============================
    // SUCCESS RESPONSE
    // ===============================
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




    // ===============================
    // CLEAR COOKIE
    // ===============================
    res.clearCookie("token", {

      httpOnly: true,

      secure: false,

      sameSite: "lax",

    });







    // ===============================
    // SUCCESS RESPONSE
    // ===============================
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