import async from "async";
import jwt from "jsonwebtoken";
import Language from "../models/language.js";
import Word from "../models/word.js";

const getWord = (req, res) => {
  const language = req.params.id;

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(401);
    // First checking if user is allowed in language project
    Language.find(
      { $and: [{ _id: language }, { $or: [{ user: authData._id }, { guestUser: authData._id }] }] },
      (err, result) => {
        if (err) return res.sendStatus(500);
        if (result.length === 0) return res.status(400).json("Not user");
        // If allowed then display language
        else {
          async.parallel(
            {
              words: (callback) => {
                Word.find({ language }).exec(callback);
              },
            },
            (err, results) => {
              if (err) return res.sendStatus(500);
              return res.status(200).json(results);
            }
          );
        }
      }
    );
  });
};

const createWord = (req, res) => {
  const word = req.body.word;
  const translation = req.body.translation;
  const definition = req.body.definition;
  const example = req.body.example;
  const pos = req.body.pos;
  const gloss = req.body.gloss;
  const languageID = req.body.languageID;
  if (word === "") return res.status(400).json("Error empty field");
  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(401);
    Language.findOne(
      { _id: languageID, $or: [{ user: authData._id }, { guestUser: authData._id }] },
      (err, result) => {
        if (err) return res.status(500).json({ message: "Project not found" });
        else {
          new Word({
            word,
            translation,
            definition,
            example,
            pos,
            gloss,
            language: result,
            user: authData._id,
          }).save((err, results) => {
            if (err) return res.status(500).json("Error create word");
            return res.status(200).json(results);
          });
        }
      }
    );
  });
};

const deleteWord = (req, res) => {
  const _id = req.params.id;

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(401);
    Word.findOneAndDelete(
      { _id, $or: [{ user: authData._id }, { guestUser: authData._id }] },
      (err, result) => {
        if (err) return res.status(500).json({ message: "Error deleting word" });
        return res.status(200).json(result);
      }
    );
  });
};

const updateWord = (req, res) => {
  const _id = req.params.id;
  const word = req.body.word;
  const translation = req.body.translation;
  const definition = req.body.definition;
  const example = req.body.example;
  const pos = req.body.pos;
  const gloss = req.body.gloss;

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(401);
    else {
      Word.findOneAndUpdate(
        { _id, $or: [{ user: authData._id }, { guestUser: authData._id }] },
        { word, translation, definition, example, pos, gloss }
      )
        .lean()
        .exec((err, result) => {
          if (err) return res.sendStatus(401);
          const obj = { ...result, word, translation, definition, example, pos, gloss };
          return res.status(200).json(obj);
        });
    }
  });
};

export { createWord, deleteWord, getWord, updateWord };
