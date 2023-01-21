import jwt from "jsonwebtoken";
import generateAccessToken from "../generateToken.js";
import Token from "../models/token.js";

const getAccessToken = (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (refreshToken === null) return res.sendStatus(401);
  const token = refreshToken.split(" ")[1];
  Token.findOne({ token }, (err, result) => {
    if (err) return res.sendStatus(500);
    if (result === null ) return res.sendStatus(401);
    jwt.verify(token, process.env.REFRESH_TOKEN, (err, authData) => {
      if (err) {
        Token.findOneAndDelete({token}, (err, result) => {
          if (err) return res.sendStatus(500);
        });
        return res.sendStatus(401);
      }
      const accessToken = generateAccessToken(authData.user);
      return res.status(200).json({ accessToken });
    });
  });
};

const logOut = (req, res) => {
  const refreshToken = req.body.refreshToken;
  const token = refreshToken.split(" ")[1];
  Token.findOneAndDelete({ token }, (err) => {
    if (err) return res.status(500).json("Error deleting token");
    return res.sendStatus(200);
  });
};

export { getAccessToken, logOut };
