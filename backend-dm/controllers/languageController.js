import async from "async";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Word from "../models/word.js";
import Language from "../models/language.js";

const getLanguage = (req, res) => {
  const type = req.params.type;

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(401);
    if (type === "all") {
      User.findById(authData._id).exec((err, result) => {
        if (err) return res.status(500).json("Error login");
        else
          async.parallel(
            {
              languages: (callback) => {
                Language.find({ $or: [{ user: result }, { guestUser: result }] })
                  .populate({path: "guestUser", select: "-email -password -__v"})
                  .populate({path: "user", select: "-email -password -__v"})
                  .select("-__v")
                  .lean()
                  .exec(callback);
              },
            },
            (err, results) => {
              if (err) {
                return res.sendStatus(500).json(err);
              }
              results.languages.forEach((item) => {
                if (item.user._id.toString() === authData._id) item.owner = true;
                else item.owner = false;
              });
              return res.status(200).json(results);
            }
          );
      });
    }
    if (type === "collab") {
      User.findById(authData._id).exec((err, result) => {
        if (err) return res.status(500).json("Error login");
        else
          async.parallel(
            {
              languages: (callback) => {
                Language.find({
                  $or: [
                    { $and: [{ user: result }, { guestUser: { $exists: true } }] },
                    { guestUser: result },
                  ],
                })
                  .lean()
                  .exec(callback);
              },
            },
            (err, results) => {
              if (err) {
                return res.status(500).json(err);
              }
              results.languages.forEach((item) => {
                if (item.user.toString() === authData._id) item.owner = true;
                else item.owner = false;
              });

              return res.status(200).json(results);
            }
          );
      });
    }
  });
};

const postLanguage = (req, res) => {
  const language = req.body.language;

  // Prevent long name
  if (language.length > 30) return res.status(400).json("Name too long");

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(401);
    else {
      User.findOne({ username: authData.username }).exec((err, result) => {
        if (err) return res.status(500).json("Error creation collection");

        if (result) {
          new Language({
            name: language,
            user: result,
          }).save((err, result) => {
            if (err) return res.status(400).json("Error field empty");
            else
              return res
                .status(200)
                .json({ message: "Collection created", _id: result._id, name: result.name });
          });
        }
      });
    }
  });
};

const deletelanguage = (req, res) => {
  const _id = req.params.id;
  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err) => {
    if (err) {
      return res.sendStatus(401);
    } else {
      // Delete language project
      Language.findOne({ _id, user: authData }, (err, result) => {
        if (err) return res.status(500).json("Error deleting collection");
        else {
          // Delete each word that were associated with the project
          // Otherwise the words would still exist in the DB
          Word.deleteMany({ language: result }, (err, result) => {
            if (err) return res.status(500).json("Error deleting");
            else {
              return res.status(200).json({ message: "Successfully deleted" });
            }
          });
        }
      });
    }
  });
};

const editLanguage = (req, res) => {
  const _id = req.params.id;
  const name = req.body.newName;

  // Prevent long name
  if (name.length > 30) return res.status(400).json("Name too long");

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) {
      return res.sendStatus(401);
    }
    Language.findOneAndUpdate({ _id, user: authData }, { name }, (err, results) => {
      if (err) {
        return res.status(500).json("Problem renaming project");
      }
      if (results === null || results === undefined) return res.status(400).json("Not authorized");
      return res.status(200).json({ message: "Project name updated" });
    });
  });
};

export { deletelanguage, editLanguage, getLanguage, postLanguage };
