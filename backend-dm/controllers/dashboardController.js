import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const checkUserLogin = (req, res) => {
  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(403);
    else {
      return res.json(authData.username);
    }
  });
};

const changePassword = (req, res) => {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  let user; // Tmp empty user

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json("Empty fields");
  }

  // Verify special characters
  const regexPattern = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])");
  const checkPattern = regexPattern.test(newPassword);
  if (!checkPattern) return res.status(400).json("Passwords special characters");

  // Verify length
  if (newPassword.length < 6) return res.status(400).json("password");

  // Verify same passwords
  if (newPassword !== confirmPassword) return res.status(400).json("Passwords don't match");

  jwt.verify(req.token, process.env.ACCESS_TOKEN, (err, authData) => {
    if (err) return res.sendStatus(403);
    // Find corresponding user with _id from authdata
    User.findById({ _id: authData._id }).exec((err, result) => {
      if (err) return res.status(500).json("There was a problem");
      if (!result) return res.status(400).json("Incorrect username or password");
      else {
        // Match, create update tmp user to update DB
        user = result;
        // Check password
        bcrypt.compare(currentPassword, result.password, (err, result) => {
          if (err) return res.status(500).json("There was a problem");
          if (!result) return res.status(400).json("Wrong password");
          if (result) {
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
              if (err) return res.status(500).json("There was a problem");
              // Update the password
              User.findByIdAndUpdate({ _id: authData._id }, { password: hashedPassword }, (err) => {
                if (err) return res.status(500).json("There was a problem");
                return res.status(200).json("Password updated");
              });
            });
          }
        });
      }
    });
  });
};

export { changePassword, checkUserLogin };
