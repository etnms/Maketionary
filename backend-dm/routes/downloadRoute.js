import express from "express";
import { downloadJSON } from "../controllers/downloadController.js";
import  verifyToken  from "../verifyToken.js";

const router = express.Router();

const downloadJSONRoute = router.get("/api/download/json", verifyToken, downloadJSON);

export {downloadJSONRoute}