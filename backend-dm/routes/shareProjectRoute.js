import express  from "express";
import { checkRequests, shareProjectRequest } from "../controllers/shareProjectController.js";
import verifyToken from "../verifyToken.js";

const router = express.Router();

const shareProjectrequestRoute = router.post("/api/shared-projects/:id", verifyToken, shareProjectRequest);
const checkRequestsRoute = router.get("/api/shared-projects", verifyToken, checkRequests)

export {checkRequestsRoute, shareProjectrequestRoute}