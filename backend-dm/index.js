import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { login, signup } from "./routes/authRoute.js";
import { dashboard } from "./routes/dashboardRoute.js";
import { deleteLanguageRoute, editLanguageRoute, getlanguageRoute, postLanguageRoute } from "./routes/languageRoute.js";
import { deleteWordRoute, getWordRoute, postWordRoute, updateWordRoute } from "./routes/wordRoute.js";
import { downloadDocxRoute, downloadJSONRoute, downloadRTFRoute, downloadXMLRoute } from "./routes/downloadRoute.js";
import mongoSanitize from "express-mongo-sanitize"

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(
  mongoSanitize({
    allowDots: true,
  }),
);

dotenv.config();

const mongoDb = process.env.MONGOKEY;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// Auth
app.use("/", signup);
app.use("/", login);
app.use("/", dashboard);

// Language
app.use("/", getlanguageRoute);
app.use("/", postLanguageRoute);
app.use("/", deleteLanguageRoute);
app.use("/", editLanguageRoute);

// Word
app.use("/", deleteWordRoute)
app.use("/", getWordRoute);
app.use("/", postWordRoute);
app.use("/", updateWordRoute);

// Download
app.use("/", downloadDocxRoute)
app.use("/", downloadJSONRoute);
app.use("/", downloadRTFRoute);
app.use("/", downloadXMLRoute);

const server = app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});

server;

server.setTimeout(45000);
