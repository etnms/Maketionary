import jwt from "jsonwebtoken";
import async from "async";
import Word from "../models/word.js";
import fs from "fs";

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
};

// Download RTF file
const downloadRTF = async (req, res) => {
  const language = req.query.projectID;
  // Prepare the download directory
  const cwd = process.cwd();
  const path = `${cwd}\\downloads\\`;
  // if folder does not exist then create it
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  // Generate random filename
  const date = Date.now();
  const filename = `${language}${date}.rtf`;
  // Get the path
  const file = `${path}\\${filename}`;

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
        // Sort the array by words
        const sortedArray = results.words.sort((a, b) => (a.word > b.word ? 1 : a.word === b.word ? 0 : -1));
        // Create stream to write all the data
        const stream = fs.createWriteStream(file, { flags: "a" });

        // FIrst write  the RTF basic
        stream.write("{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}}");
        // Loop through each word and write with stream
        sortedArray.forEach((el) => {
          stream.write(
            `{\\pard{\\tab\\b ${el.word}} (${el.pos}) ${el.translation}. Definition: ${el.definition}. Example: \\i ${el.example} \\par}`
          );
        });
        // End of document requires closing
        stream.write("}");
        stream.end();

        // Once the stream is over then download file
        stream.on("finish", () => {
          return res.download(file, filename, (err) => {
            if (err) {
              console.log(err);
              res.status(400).json({ error: "Error downloading file" });
            }
            // If no error then delete file from server
            // else fs.unlinkSync(file);
          });
        });
      }
    );
  });
};

export { downloadJSON, downloadRTF };
