import jwt from "jsonwebtoken";
import generateAccessToken from "../generateToken.js";
import Token from "../models/token.js";

const getAccessToken = (req, res) => {
  const refreshToken = req.body.refreshToken;
  const token = refreshToken.split(" ")[1];
  if (refreshToken === null) return res.sendStatus(401);
  Token.findOne({ token }, (err, result) => {
    if (err) return res.sendStatus(403);
    if (result === null ) return res.sendStatus(403);
    jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const accessToken = generateAccessToken(user);
      return res.status(200).json({ accessToken });
    });
  });
};

const logOut = (req, res) => {
  const refreshToken = req.body.refreshToken;
  const token = refreshToken.split(" ")[1];
  Token.findOneAndDelete({ token }, (err) => {
    if (err) return res.status(400).json("error deleting token");
    return res.sendStatus(200);
  });
};

export { getAccessToken, logOut };
