import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {

  try {

    // cookie থেকে token নিচ্ছি
    const token = req.cookies.token;

    // token না থাকলে
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // token verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // user info request এ save
    req.user = decoded;

    // next middleware/function এ যাবে
    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });

  }

};

export default verifyToken;