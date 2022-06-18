import express from "express";
import { downloadDocx, downloadJSON, downloadRTF, downloadXML } from "../controllers/downloadController.js";
import  verifyToken  from "../verifyToken.js";

const router = express.Router();

const downloadDocxRoute = router.get("/api/download/docx", verifyToken, downloadDocx);
const downloadJSONRoute = router.get("/api/download/json", verifyToken, downloadJSON);
const downloadRTFRoute = router.get("/api/download/rtf", verifyToken, downloadRTF);
const downloadXMLRoute = router.get("/api/download/xml", verifyToken, downloadXML)

export {downloadDocxRoute, downloadJSONRoute, downloadRTFRoute, downloadXMLRoute}