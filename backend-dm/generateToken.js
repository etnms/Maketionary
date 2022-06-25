import jwt from "jsonwebtoken";
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWTKEY, { expiresIn: "15s" })
};

export default generateAccessToken;
