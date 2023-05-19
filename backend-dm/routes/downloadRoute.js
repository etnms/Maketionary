import express from "express";
import { downloadDocx, downloadJSON, downloadLatex, downloadPDF, downloadRTF, downloadXML } from "../controllers/downloadController.js";
import  verifyToken  from "../verifyToken.js";

const router = express.Router();

const downloadDocxRoute = router.get("/api/download/docx", verifyToken, downloadDocx);
const downloadJSONRoute = router.get("/api/download/json", verifyToken, downloadJSON);
const downloadRTFRoute = router.get("/api/download/rtf", verifyToken, downloadRTF);
const downloadPDFRoute = router.get("/api/download/pdf", verifyToken, downloadPDF);
const downloadXMLRoute = router.get("/api/download/xml", verifyToken, downloadXML);
const downloadLatexRoute = router.get("/api/download/tex", verifyToken, downloadLatex)

export {downloadDocxRoute, downloadJSONRoute, downloadPDFRoute, downloadRTFRoute, downloadXMLRoute, downloadLatexRoute}