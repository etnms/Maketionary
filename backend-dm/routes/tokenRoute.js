import express from "express";
import { getAccessToken } from "../controllers/tokenController.js";

const router = express.Router();

const tokenRoute = router.post("/api/token", getAccessToken);

export { tokenRoute };
