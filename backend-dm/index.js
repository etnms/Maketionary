import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import { login, signup } from "./routes/authRoute.js";
import { dashboard } from "./routes/dashboardRoute.js";
import { deleteLanguageRoute, editLanguageRoute, getlanguageRoute, postLanguageRoute } from "./routes/languageRoute.js";
import { deleteWordRoute, getWordRoute, postWordRoute, updateWordRoute } from "./routes/wordRoute.js";
import { downloadDocxRoute, downloadJSONRoute, downloadPDFRoute, downloadRTFRoute, downloadXMLRoute } from "./routes/downloadRoute.js";
import mongoSanitize from "express-mongo-sanitize"
import { logOutRoute, tokenRoute } from "./routes/tokenRoute.js";
import { answerRequestRoute, checkRequestsRoute, removeUserRoute, shareProjectrequestRoute } from "./routes/shareProjectRoute.js";

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
app.use("/", tokenRoute);
app.use("/", logOutRoute);

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
app.use("/", downloadPDFRoute);

// Shared projects
app.use("/", shareProjectrequestRoute);
app.use("/", checkRequestsRoute);
app.use("/", answerRequestRoute);
app.use("/", removeUserRoute)

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {

  socket.on("join", (args) => {
    socket.join(args)
    })
    
  socket.on("msg", (args) => {
    socket.broadcast.to(args.language._id).emit("msg", {room:args.language._id, args: args});
    socket.leave(args.language._id)
    //io.emit('chat message', args);
    //socket.broadcast.emit("msg", args);
  })
  
  socket.on("delete", (word) => {
    socket.broadcast.to(word.language).emit("delete", {room: word.language, word: word});
    socket.leave(word.language);
  })

  socket.on("update", (word) => {
    socket.broadcast.to(word.language).emit("update", {room: word.language, word: word});
    socket.leave(word.language);
  })
  
  
  socket.on("disconnect", () => {
    //console.log("Client disconnected");

  })
});
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
server.setTimeout(45000);
