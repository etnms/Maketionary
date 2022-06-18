import jwt from "jsonwebtoken";
import async from "async";
import Word from "../models/word.js";
import fs from "fs";
import pkg from "docx";
const { Document, Packer, Paragraph, TextRun } = pkg;

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
const downloadRTF = (req, res) => {
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
  const filename = `${language}${date}.odt`;
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
            `{\\pard{\\b ${el.word}} (${el.pos}) ${el.translation} Definition: ${el.definition} Example: \\i ${el.example} \\par}`
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
            else fs.unlinkSync(file);
          });
        });
      }
    );
  });
};
// Constructor for docx
class DocumentCreator {
  create([words]) {
    const document = new Document({
      sections: [
        {
          children: [
            ...words
              .map((word) => {
                const arr = [];
                arr.push(
                  this.createEntry(
                    word.word,
                    word.translation,
                    word.definition,
                    word.example,
                    word.pos,
                    word.gloss
                  )
                );
                return arr;
              })
              .reduce((prev, curr) => prev.concat(curr), []),
          ],
        },
      ],
    });
    return document;
  }

  createEntry(word, translation, definition, example, pos, gloss) {
    return new Paragraph({
      children: [
        new TextRun({
          text: word,
          bold: true,
          size: 24,
          font: "Arial",
        }),
        new TextRun({
          text: ` (${pos}) `,
          size: 24,
          font: "Arial",
        }),
        new TextRun({
          text: translation,
          size: 24,
          font: "Arial",
        }),
        new TextRun({
          text: ` Definition: ${definition}`,
          size: 24,
          font: "Arial",
        }),
        new TextRun({
          text: example,
          italics: true,
          size: 24,
          font: "Arial",
        }),
      ],
    });
  }
}
// Download RTF file
const downloadDocx = (req, res) => {
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
  const filename = `${language}${date}.docx`;
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
        // Create the docx
        const documentCreator = new DocumentCreator();
        const doc = documentCreator.create([sortedArray]);
        // Used to export the file into a .docx file
        Packer.toBuffer(doc).then((buffer) => {
          fs.writeFileSync(file, buffer);
          return res.download(file, filename, (err) => {
            if (err) {
              console.log(err);
              res.status(400).json({ error: "Error downloading file" });
            }
            // If no error then delete file from server
            else fs.unlinkSync(file);
          });
        });
      }
    );
  });
};

const downloadXML = (req, res) => {
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
  const filename = `${language}${date}.xml`;
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
        stream.write('<?xml version="1.0" encoding="utf-8"?>\n');
        stream.write(`<Dictionary xmlns:Test="Test">`);
        // Loop through each word and write with stream
        sortedArray.forEach((el) => {
          stream.write(
            `\n<Entry><Word>${el.word}</Word><Translation>${el.translation}</Translation><Definition>${el.definition}</Definition><Example>${el.example}</Example><POS>${el.pos}</POS><Gloss>${el.gloss}</Gloss></Entry>`
          );
        });
        // End of document requires closing
        stream.write("</Dictionary>");
        stream.end();

        // Once the stream is over then download file
        stream.on("finish", () => {
          return res.download(file, filename, (err) => {
            if (err) {
              console.log(err);
              res.status(400).json({ error: "Error downloading file" });
            }
            // If no error then delete file from server
            else fs.unlinkSync(file);
          });
        });
      }
    );
  });
};

export { downloadDocx, downloadJSON, downloadRTF, downloadXML };
