import jwt from "jsonwebtoken";
import translatePos from "../helpers/translatePos.js";
import async from "async";
import Word from "../models/word.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import pkg from "docx";
import { translateTextDocument } from "../helpers/translateTextDocument.js";
const { Document, Packer, Paragraph, TextRun } = pkg;

const downloadJSON = (req, res) => {
  const projectID = req.query.projectID;
  const lang = req.query.lang;
  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err) => {
    if (err) return res.sendStatus(401);
    async.parallel(
      {
        words: (callback) => {
          // Callback to get each word, then remove non-required field for users with select
          Word.find({ language: projectID }).select("-_id -language -__v").exec(callback);
        },
      },
      (err, results) => {
        if (err) return res.sendStatus(500);
        // Translate the pos 
        results.words.forEach(el => el.pos = translatePos(el.pos, lang))
        return res.status(200).json({ results });
      }
    );
  });
};

const downloadRTF = (req, res) => {
  const projectID = req.query.projectID;
  const lang = req.query.lang;
  // Prepare the download directory
  const cwd = process.cwd();
  const path = `${cwd}\\downloads\\`;
  // if folder does not exist then create it
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  // Generate random filename
  const date = Date.now();
  const filename = `${projectID}${date}.odt`;
  // Get the path
  const file = `${path}\\${filename}`;

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err) => {
    if (err) return res.sendStatus(401);
    async.parallel(
      {
        words: (callback) => {
          // Callback to get each word, then remove non-required field for users with select
          Word.find({ language: projectID }).select("-_id -language -__v").exec(callback);
        },
      },
      (err, results) => {
        if (err) return res.sendStatus(500);
        // Sort the array by words
        const sortedArray = results.words.sort((a, b) => (a.word > b.word ? 1 : a.word === b.word ? 0 : -1));
        // Create stream to write all the data
        const stream = fs.createWriteStream(file, { flags: "a" });

        // FIrst write  the RTF basic
        stream.write("{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}}");
        // Loop through each word and write with stream
        sortedArray.forEach((el) => {
          stream.write(
            `{\\pard{\\b ${el.word}} (${translatePos(el.pos, lang)}) ${
              el.translation
            } ${translateTextDocument("definition", lang)}: ${el.definition} {${translateTextDocument(
              "example",
              lang
            )}}: \\i ${el.example} \\par}`
          );
        });
        // End of document requires closing
        stream.write("}");
        stream.end();

        // Once the stream is over then download file
        stream.on("finish", () => {
          return res.download(file, filename, (err) => {
            if (err) {
              res.status(500).json( "Error downloading file" );
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
  create([words], lang) {
    const document = new Document({
      sections: [
        {
          children: [
            ...words
              .map((word) => {
                const arr = [];
                arr.push(
                  this.createEntry(word.word, word.translation, word.definition, word.example, word.pos, lang)
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

  createEntry(word, translation, definition, example, pos, lang) {
    return new Paragraph({
      children: [
        new TextRun({
          text: word,
          bold: true,
          size: 24,
          font: "Arial",
        }),
        new TextRun({
          text: ` (${translatePos(pos, lang)}) `,
          size: 24,
          font: "Arial",
        }),
        new TextRun({
          text: translation,
          size: 24,
          font: "Arial",
        }),
        new TextRun({
          text: ` ${translateTextDocument("definition", lang)}: ${definition}`,
          size: 24,
          font: "Arial",
        }),
        new TextRun({
          text: ` ${translateTextDocument("example", lang)}: ${example}`,
          italics: true,
          size: 24,
          font: "Arial",
        }),
      ],
    });
  }
}

const downloadDocx = (req, res) => {
  const projectID = req.query.projectID;
  const lang = req.query.lang;
  // Prepare the download directory
  const cwd = process.cwd();
  const path = `${cwd}\\downloads\\`;
  // if folder does not exist then create it
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  // Generate random filename
  const date = Date.now();
  const filename = `${projectID}${date}.docx`;
  // Get the path
  const file = `${path}\\${filename}`;

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err) => {
    if (err) return res.sendStatus(401);
    async.parallel(
      {
        words: (callback) => {
          // Callback to get each word, then remove non-required field for users with select
          Word.find({ language: projectID }).select("-_id -language -__v").exec(callback);
        },
      },
      (err, results) => {
        if (err) return res.sendStatus(500);
        // Sort the array by words
        const sortedArray = results.words.sort((a, b) => (a.word > b.word ? 1 : a.word === b.word ? 0 : -1));
        // Create the docx
        const documentCreator = new DocumentCreator();
        const doc = documentCreator.create([sortedArray], lang);
        // Used to export the file into a .docx file
        Packer.toBuffer(doc).then((buffer) => {
          fs.writeFileSync(file, buffer);
          return res.download(file, filename, (err) => {
            if (err) {
              res.status(500).json( "Error downloading file" );
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
  const projectID = req.query.projectID;
  const lang = req.query.lang;
  // Prepare the download directory
  const cwd = process.cwd();
  const path = `${cwd}\\downloads\\`;
  // if folder does not exist then create it
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  // Generate random filename
  const date = Date.now();
  const filename = `${projectID}${date}.xml`;
  // Get the path
  const file = `${path}\\${filename}`;

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err) => {
    if (err) return res.sendStatus(401);
    async.parallel(
      {
        words: (callback) => {
          // Callback to get each word, then remove non-required field for users with select
          Word.find({ language: projectID }).select("-_id -language -__v").exec(callback);
        },
      },
      (err, results) => {
        if (err) return res.sendStatus(500);
        // Sort the array by words
        const sortedArray = results.words.sort((a, b) => (a.word > b.word ? 1 : a.word === b.word ? 0 : -1));
        // Create stream to write all the data
        const stream = fs.createWriteStream(file, { flags: "a" });

        // FIrst write  the RTF basic
        stream.write('<?xml version="1.0" encoding="utf-8"?>\n');
        stream.write(`<Dictionary xmlns:Dict="Dictionary">`);
        // Loop through each word and write with stream
        sortedArray.forEach((el) => {
          stream.write(
            `\n<Entry><Word>${el.word}</Word><Translation>${el.translation}</Translation><Definition>${
              el.definition
            }</Definition><Example>${el.example}</Example><POS>${translatePos(el.pos, lang)}</POS><Gloss>${
              el.gloss
            }</Gloss></Entry>`
          );
        });
        // End of document requires closing
        stream.write("</Dictionary>");
        stream.end();

        // Once the stream is over then download file
        stream.on("finish", () => {
          return res.download(file, filename, (err) => {
            if (err) {
              res.status(500).json( "Error downloading file" );
            }
            // If no error then delete file from server
            else fs.unlinkSync(file);
          });
        });
      }
    );
  });
};

// Download RTF file
const downloadPDF = (req, res) => {
  const projectID = req.query.projectID;
  const lang = req.query.lang;

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err) => {
    if (err) return res.sendStatus(401);
    const doc = new PDFDocument();

    async.parallel(
      {
        words: (callback) => {
          // Callback to get each word, then remove non-required field for users with select
          Word.find({ language: projectID }).select("-_id -language -__v").exec(callback);
        },
      },
      (err, results) => {
        if (err) return res.sendStatus(500);
        // Sort the array by words
        const sortedArray = results.words.sort((a, b) => (a.word > b.word ? 1 : a.word === b.word ? 0 : -1));
        // pipe res to directly send http answer no need to write file
        doc.pipe(res);

        // Loop through each word and write with stream
        sortedArray.forEach((el) => {
          doc
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(`${el.word} `, { continued: true })
            .font("Helvetica")
            .text(
              `(${translatePos(el.pos, lang)}) ${el.translation} \n${translateTextDocument(
                "definition",
                lang
              )}: ${el.definition} \n${translateTextDocument("example", lang)}: ${el.example}`
            );
        });
        doc.end();
      }
    );
  });
};

export { downloadDocx, downloadJSON, downloadPDF, downloadRTF, downloadXML };
