import express  from "express";
import { answerRequest, checkRequests, removeUserFromProject, shareProjectRequest } from "../controllers/shareProjectController.js";
import verifyToken from "../verifyToken.js";

const router = express.Router();

const shareProjectrequestRoute = router.post("/api/shared-projects/:id", verifyToken, shareProjectRequest);
const checkRequestsRoute = router.get("/api/shared-projects", verifyToken, checkRequests);
const answerRequestRoute = router.post("/api/shared-projects/answer/:id", verifyToken, answerRequest)
const removeUserRoute = router.put("/api/shared-projects/:id", verifyToken, removeUserFromProject)

export {answerRequestRoute, checkRequestsRoute, shareProjectrequestRoute, removeUserRoute}