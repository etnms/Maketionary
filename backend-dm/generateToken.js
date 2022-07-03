import jwt from "jsonwebtoken";
const generateAccessToken = (user) => {
  try{
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "20m" })
  }
  catch(err) {
    return null;
  }
};

export default generateAccessToken;
