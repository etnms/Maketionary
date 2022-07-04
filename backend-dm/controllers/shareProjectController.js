import jwt from "jsonwebtoken";
import collabrequest from "../models/collabRequest.js";
import User from "../models/user.js";
import async from "async";

const shareProjectRequest = (req, res) => {
  const id = req.params.id;
  const userInfo = req.body.user;
  console.log(id, userInfo);
  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(403);
    User.findOne({ $or: [{ username: userInfo }, { email: userInfo }] }, (err, result) => {
      if (err) res.status(400).json("Error: user not found");
      new collabrequest({
        project: id,
        requestedUser: result,
      }).save((err) => {
        if (err) return res.status(500).json("Error db");
        else return res.sendStatus(200);
      });
    });
  });
};

const checkRequests = (req, res) => {
  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(403);
    async.parallel(
      {
        collabRequest: (callback) => {
          collabrequest.find({ requestedUser: authData._id }).populate("requestedUser").exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return res.status(400).send(err);
        }
        return res.status(200).json({ results });
      }
    );
  });
};

export { checkRequests, shareProjectRequest };
