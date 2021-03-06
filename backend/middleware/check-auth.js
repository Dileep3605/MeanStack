const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.verify(
      token,
      "Mean_Stack_Project_Front_End_Development"
    );
    req.userData = { email: decodeToken.email, userId: decodeToken.userId };
    next();
  } catch {
    res.status(401).json({
      message: "Auth Failed",
    });
  }
};
