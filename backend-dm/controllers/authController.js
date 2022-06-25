import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const userLogin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let user; // Tmp empty user

  if (!username || !password) {
    return res.status(400).json("Empty fields");
  }

  User.findOne({ username }).exec((err, result) => {
    if (err) return res.status(400).json("There was a problem");
    if (!result) return res.status(400).json("Incorrect username or password");
    else {
      // Update tmp user to the corresponding user
      user = result;

      // Check passwords
      bcrypt.compare(password, result.password, (err, result) => {
        if (err) return res.status(400).json("There was a problem");
        if (!result) return res.status(400).json("Incorrect username or password");
        if (result) {
          // Log in user
          jwt.sign({ user }, process.env.JWTKEY, { expiresIn: "7d" }, (err, token) => {
            if (err) return res.sendStatus(403);
            return res.status(200).json({ token: `Bearer ${token}` });
          });
        }
      });
    }
  });
};

const userSignup = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const regexPattern = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])");
  const checkPattern = regexPattern.test(password);
  if (!checkPattern) return res.status(400).json("Passwords special characters");

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  // If errors only return the first one, frontend will deal with displaying each individual error
  if (!errors.isEmpty()) return res.status(400).json(errors.array()[0].param);

  if (password !== confirmPassword) return res.status(400).json("Passwords need to match");
  if (username == "") return res.status(400).json("Empty username");

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(400).json("There was a problem");

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    // Create user
    user.save((err) => {
      if (err) {
        // Check for unique user, if err return err, otherwise user added to db
        if (err.code === 11000 && err.keyPattern.username === 1)
          return res.status(400).json("Username already exists");
        if (err.code === 11000 && err.keyPattern.email === 1)
          return res.status(400).json("Email already exists");
        else return res.status(400).json("There was an error");
      } else {
        // Log in user
        jwt.sign({ user }, process.env.JWTKEY, { expiresIn: "7d" }, (err, token) => {
          if (err) return res.sendStatus(403);
          return res.status(200).json({ token: `Bearer ${token}`, message: "User created" });
        });
      }
    });
  });
};

export { userLogin, userSignup };
