const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  // console.log("This is authHeader", authHeader);
  // Check if the Authorization header is present
  // console.log(authHeader);
  if (!authHeader) {
    console.log("no auth header");
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  }
  const tokenParts = authHeader.split(" ");
  // console.log(tokenParts);
  // Validate token format
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token format" });
  }

  const jwtToken = tokenParts[1];
  // console.log(jwtToken);
  try {
    // Verify the JWT token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    // console.log(decoded);
    // Fetch the user from the database
    req.user = await User.findById(decoded.userId);
    console.log(req.user);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found, authorization denied",
      });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token or token expired",
    });
  }
};
