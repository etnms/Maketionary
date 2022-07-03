import async from "async";
import jwt from "jsonwebtoken";
import Language from "../models/language.js";
import Word from "../models/word.js";

const getWord = (req, res) => {
  const language = req.params.id;

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(403);
    async.parallel(
      {
        words: (callback) => {
          Word.find({ language, user: authData._id }).exec(callback);
        },
      },
      (err, results) => {
        if (err) return res.sendStatus(400);
        return res.status(200).json({ results });
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

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(403);
    Language.findOne({ _id: languageID, user: authData._id }, (err, result) => {
      if (err) return res.status(400).json({ message: "Project not found" });
      else {
        new Word({
          word,
          translation,
          definition,
          example,
          pos,
          gloss,
          language: result,
          user: authData._id
        }).save((err, results) => {
          if (err) return res.status(400).json("Error empty field");
          return res.status(200).json({ results });
        });
      }
    });
  });
};

const deleteWord = (req, res) => {
  const _id = req.params.id;

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(403);
    Word.findOneAndDelete({ _id, user: authData._id }, (err) => {
      if (err) return res.status(400).json({ message: "Error deleting word" });
      return res.status(200).json({ message: "Word deleted" });
    });
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
    if (err) return res.sendStatus(403);
    else {
      Word.findOneAndUpdate({ _id, user: authData._id }, { word, translation, definition, example, pos, gloss }, (err) => {
        if (err) return res.sendStatus(403);
        return res.status(200).json({ message: "Word was updated" });
      });
    }
  });
};

export { createWord, deleteWord, getWord, updateWord };
