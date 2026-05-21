import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {

  try {

    // get token from cookies
    const token = req.cookies.token;

    // no token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // save user info
    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }

};

export default verifyToken;

