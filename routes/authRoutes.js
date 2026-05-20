import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";

// middleware
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();



// ===============================
// REGISTER ROUTE
// ===============================
router.post("/register", registerUser);




// ===============================
// LOGIN ROUTE
// ===============================
router.post("/login", loginUser);




// ===============================
// LOGOUT ROUTE
// ===============================
router.post("/logout", logoutUser);




// ===============================
// CURRENT USER ROUTE
// ===============================
router.get("/me", verifyToken, (req, res) => {

  res.status(200).json({
    success: true,
    user: req.user,
  });

});



export default router;