import express from "express";
import { createWord, deleteWord, getWord, updateWord } from "../controllers/wordController.js";
import verifyToken from "../verifyToken.js";

const router = express.Router();

const deleteWordRoute = router.delete("/api/word", verifyToken, deleteWord);
const getWordRoute = router.get("/api/word", verifyToken, getWord);
const postWordRoute = router.post("/api/word", verifyToken, createWord);
const updateWordRoute = router.put("/api/word", verifyToken, updateWord);

export { deleteWordRoute, getWordRoute, postWordRoute, updateWordRoute };
