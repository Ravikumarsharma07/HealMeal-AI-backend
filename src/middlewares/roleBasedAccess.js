import jwt from "jsonwebtoken";

const authoriseRole = (...roles) => {
  return (req, res, next) => {
      const { token } = req.cookies;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded)
        return res.status(401).json({
          message: "Invalid token or token expired",
          redirectURL: "/login",
        });
      const { role } = decoded;
      if (roles.includes(role)) {
        next();
      } else {
        return res.status(403).json({
          message: "unauthorised admin",
          redirectURL: "/login",
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal server error", redirectURL: "/login" });
    }
  };
};

export default authoriseRole