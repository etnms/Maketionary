import jwt from "jsonwebtoken";
import generateAccessToken from "../generateToken.js";

let refreshTokens = [];

const getAccessToken = (req, res) => {
  const refreshToken = req.body.refreshToken;
  const token = refreshToken.split(" ")[1];
  if (refreshToken === null) return res.sendStatus(401);
  //if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    const accessToken = generateAccessToken(user.user);
    return res.status(200).json({ accessToken });
  });
};

export { getAccessToken };
