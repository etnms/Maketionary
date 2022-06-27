import express from "express";
import { getAccessToken, logOut } from "../controllers/tokenController.js";

const router = express.Router();

const tokenRoute = router.post("/api/token", getAccessToken);
const logOutRoute = router.delete("/api/token", logOut);

export { logOutRoute, tokenRoute };
