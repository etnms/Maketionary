import jwt from "jsonwebtoken";
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "20m" })
};

export default generateAccessToken;
