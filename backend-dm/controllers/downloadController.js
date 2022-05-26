import jwt from "jsonwebtoken";
import async from "async";
import Word from "../models/word.js";


const downloadJSON = (req, res) => {
    const language = req.query.projectID;

    jwt.verify(req.token, process.env.JWTKEY, (err) => {
      if (err) return res.sendStatus(403);
      async.parallel(
        {
          words: (callback) => {

            // Callback to get each word, then remove non-required field for users with select
            Word.find({ language }).select("-_id -language -__v").exec(callback);
          },
        },
        (err, results) => {
          if (err) return res.status(400);
  
          return res.status(200).json({ results });
        }
      );
    });
}

export {downloadJSON}