import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authStyle from "../styles/Login.module.css";
import buttons from "../styles/Buttons.module.css";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Maketionary - Login";
    // Toggle darktheme
    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");
  });

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (document.querySelector("input[name='username']") as HTMLInputElement).value;
    const password = (document.querySelector("input[name='password']") as HTMLInputElement).value;
    axios
      .post(`${process.env.REACT_APP_BACKEND}/api/login`, { username, password })
      .then((res) => {
        console.log(res);
        localStorage.setItem("token", res.data.token);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={authStyle.bg}>
      <form onSubmit={(e) => login(e)} className={authStyle.auth}>
        <h1 className={authStyle.title}>Login</h1>
        <div className={authStyle["wrapper-input"]}>
          <label htmlFor="username" className={authStyle["input-label"]}>
            Username
          </label>
          <input type="text" name="username" className={authStyle["input-text"]} />
          <div className={authStyle["wrapper-password-text"]}>
            <label htmlFor="password" className={authStyle["input-label"]}>
              Password
            </label>
            <span className={authStyle.tooltip}>
              ?
              <span className={authStyle.tooltiptext}>
                Passwords contain 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.
              </span>
            </span>
          </div>
          <input type="password" name="password" className={authStyle["input-text"]} />
        </div>
        <span className={buttons["wrapper-btns"]}>
          <button type="submit" className={buttons["btn-open"]}>
            Login
          </button>
          <button className={buttons["btn-cancel"]} onClick={() => navigate("/")}>
            Home
          </button>
        </span>
      </form>
    </div>
  );
};

export default Login;
