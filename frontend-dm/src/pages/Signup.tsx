import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authStyle from "../styles/Login.module.css";
import buttons from "../styles/Buttons.module.css";

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Maketionary - Sign up";
    // Toggle darktheme
    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");
  });

  const navigateIndex = () => {
    navigate("/");
  };


  const signup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (document.querySelector("input[name='email']") as HTMLInputElement).value;
    const username = (document.querySelector("input[name='username']") as HTMLInputElement).value;
    const password = (document.querySelector("input[name='password']") as HTMLInputElement).value;
    const confirmPassword = (document.querySelector("input[name='confirm-password']") as HTMLInputElement)
      .value;

    axios
      .post(`${process.env.REACT_APP_BACKEND}/api/signup`, { email, username, password, confirmPassword })
      .then((res) => {
        if (res.data.message === "User created") {
            console.log(res);
          localStorage.setItem("token", res.data.token);
          navigateIndex();
        }
      })
      .catch((err) => {
          console.log(err);
        switch (err.response.data) {
          case "Empty username":
            return setErrorMessage("Error: username is empty");
          case "There was a problem":
            return setErrorMessage("Error: there was a problem.");
          case "Username already exists":
            return setErrorMessage("Error: username is already being used.");
          case "Email already exists":
            return setErrorMessage("Error: email is already being used");
          case "email":
            return setErrorMessage("Error: you need to enter your email adress.");
          case "password":
            return setErrorMessage("Error: your password needs to be at least 6 characters long.");
          case "Passwords special characters":
            return setErrorMessage(
              "Error: your password must contain 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character."
            );
          case "Passwords need to match":
            return setErrorMessage("Error: passwords need to match.");
        }
      });
  };

  const handleChange = () => {
    const email = (document.querySelector("input[name='email']") as HTMLInputElement).value;
    const username = (document.querySelector("input[name='username']") as HTMLInputElement).value;
    const password = (document.querySelector("input[name='password']") as HTMLInputElement).value;
    const confirmPassword = (document.querySelector("input[name='confirm-password']") as HTMLInputElement)
      .value;
    switch (errorMessage) {
      case "Error: Username is empty":
        if (username !== "") setErrorMessage("");
        break;
      case "Error: passwords need to match.":
        if (password === confirmPassword) setErrorMessage("");
        break;
      case "Error: you need to enter your email adress.":
        if (email !== "") setErrorMessage("");
        break;
      case "Error: your password needs to be at least 6 characters long.":
        if (password.length > 6) setErrorMessage("");
        break;
      case "Error: your password must contain 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.":
        const regexPattern = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])");
        const checkPattern = regexPattern.test(password);
        if (checkPattern) setErrorMessage("");
        break;
      default:
        return;
    }
  };
  return (
    <div className={authStyle.bg}>
      <form onSubmit={(e) => signup(e)}className={authStyle.auth}>
        <h1 className={authStyle.title}>Sign up</h1>
        <div className={authStyle["wrapper-input"]}>
          <label htmlFor="email" className={authStyle["input-label"]}>
            Email
          </label>
          <input type="email" name="email" className={authStyle["input-text"]} onChange={() => handleChange()} />
          <label htmlFor="username" className={authStyle["input-label"]}>
            Username
          </label>
          <input type="text" name="username" className={authStyle["input-text"]} onChange={() => handleChange()} />
          <label htmlFor="password" className={authStyle["input-label"]}>
            Password
          </label>
          <input type="password" name="password"className={authStyle["input-text"]}onChange={() => handleChange()} />
          <label htmlFor="confirm-password" className={authStyle["input-label"]}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm-password"
            className={authStyle["input-text"]}
            onChange={() => handleChange()}
          />
        </div>
        {errorMessage !== "" ? "error" : null}
        <span className={buttons["wrapper-btns"]}>
          <button type="submit" className={buttons["btn-open"]}>
            Sign up
          </button>
          <button className={buttons["btn-cancel"]} onClick={() => navigateIndex()}>
            Home
          </button>
        </span>
      </form>
    </div>
  );
};

export default Signup;
