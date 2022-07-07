import jwt from "jsonwebtoken";
import CollabRequest from "../models/collabRequest.js";
import User from "../models/user.js";
import Language from "../models/language.js";
import async from "async";

// Controller for all the share project logic
// Creating sharing request and dealing with clien answers

const shareProjectRequest = (req, res) => {
  const id = req.params.id;
  const userInfo = req.body.user;

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(401);

    User.findOne({ $or: [{ username: userInfo }, { email: userInfo }] }, (err, result) => {
      if (err || result === null) return res.status(400).json("Error: user not found");
      CollabRequest.findOne({ project: id, requestedUser: result }, (err, results) => {
        if (err) return res.sendStatus(500);
        if (results !== null) return res.status(400).json("Error: request already sent");
        else {
          new CollabRequest({
            project: id,
            sender: authData.username,
            requestedUser: result,
          }).save((err) => {
            if (err) return res.status(500).json("Error db");
            return res.sendStatus(200);
          });
        }
      });
    });
  });
};

const checkRequests = (req, res) => {
  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(401);
    async.parallel(
      {
        collabRequest: (callback) => {
          CollabRequest.find({ requestedUser: authData._id })
            .select("-__v")
            .populate("project", { name: 1, user: 1 })
            .exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return res.sendStatus(500).json({ err });
        }
        return res.status(200).json({ results });
      }
    );
  });
};

const answerRequest = (req, res) => {
  const requestId = req.params.id;
  const accepted = req.body.accepted;
  if (accepted === null || accepted === undefined) return res.status(400).json("Empty request response");
  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(401);
    if (accepted)
      CollabRequest.findByIdAndDelete(requestId, (err, result) => {
        if (err) return res.sendStatus(500);
        Language.findByIdAndUpdate(result.project, { $push: { guestUser: authData._id } }, (err, results) => {
          if (err) return res.sendStatus(500);
          return res.status(200).json("Request accepted");
        });
      });
    if (!accepted)
      CollabRequest.findByIdAndDelete(requestId, (err) => {
        if (err) return res.sendStatus(500);
        return res.status(200).json("Request refused");
      });
  });
};

export { answerRequest, checkRequests, shareProjectRequest };
