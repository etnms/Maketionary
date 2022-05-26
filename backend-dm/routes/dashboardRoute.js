import express from "express";
import  verifyToken  from "../verifyToken.js";
import { changePassword, checkUserLogin } from "../controllers/dashboardController.js";

const router = express.Router();

const dashboard = router.get("/api/dashboard", verifyToken, checkUserLogin);

const dashboardPasswordChange = router.put("/api/dashboard/change-password", verifyToken, changePassword);

export { dashboard, dashboardPasswordChange};