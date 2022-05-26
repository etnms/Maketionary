import express from "express";
import { userLogin, userSignup } from "../controllers/authController.js";
import { body } from 'express-validator';

const router = express.Router();

const login = router.post("/api/login", userLogin);

const signup = router.post("/api/signup",  body('email').isEmail().normalizeEmail(),
body('password').isLength({ min: 6 }), userSignup);

export {login, signup};