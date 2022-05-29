import express from "express";
import { downloadJSON, downloadRTF } from "../controllers/downloadController.js";
import  verifyToken  from "../verifyToken.js";

const router = express.Router();

const downloadJSONRoute = router.get("/api/download/json", verifyToken, downloadJSON);
const downloadRTFRoute = router.get("/api/download/rtf", verifyToken, downloadRTF )

export {downloadJSONRoute, downloadRTFRoute}