import express from "express";
import { deletelanguage, editLanguage, getLanguage, postLanguage } from "../controllers/languageController.js";
import verifyToken from "../verifyToken.js";

const router = express.Router();

const deleteLanguageRoute = router.delete("/api/language/:id", verifyToken, deletelanguage);
const editLanguageRoute = router.put("/api/language/:id", verifyToken, editLanguage);
const getlanguageRoute = router.get("/api/language/:type", verifyToken, getLanguage);
const postLanguageRoute = router.post("/api/language", verifyToken, postLanguage);


export { deleteLanguageRoute, editLanguageRoute, getlanguageRoute, postLanguageRoute };