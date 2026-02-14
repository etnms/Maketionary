import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authStyle from "../styles/Login.module.css";
import buttons from "../styles/Buttons.module.css";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../components/ErrorMessage";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    document.title = t("pageTitles.login");
    // Toggle darktheme
    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");
  });

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (
      document.querySelector("input[name='username']") as HTMLInputElement
    ).value;
    const password = (
      document.querySelector("input[name='password']") as HTMLInputElement
    ).value;
    axios
      .post(`${import.meta.env.VITE_APP_BACKEND}/api/login`, {
        username,
        password,
      })
      .then((res) => {
        // Remove project parameters for new connexion
        localStorage.removeItem("project");
        localStorage.removeItem("projectName");
        // Save token
        localStorage.setItem("refreshToken", res.data.refreshToken);
        sessionStorage.setItem("accessToken", res.data.accessToken);
        navigate("/dashboard");
      })
      .catch((err) => {
        switch (err.response.data) {
          case "Empty fields":
            return setErrorMessage(t("errorMessages.emptyFields"));
          case "Incorrect username or password":
            return setErrorMessage(t("errorMessages.errorIncorrectAuthCreds"));
          case "There was a problem":
            return setErrorMessage(t("errorMessages.errorProblem"));
          default:
            return setErrorMessage(t("errorMessages.errorProblem"));
        }
      });
  };

  // Handle change to check if fields corresponds to their supposed values
  const handleChange = () => {
    const username = (
      document.querySelector("input[name='username']") as HTMLInputElement
    ).value;
    const password = (
      document.querySelector("input[name='password']") as HTMLInputElement
    ).value;
    switch (errorMessage) {
      case t("errorMessages.emptyFields"):
        if (username !== "" && password !== "") setErrorMessage("");
        break;
      case t("errorMessages.errorIncorrectAuthCreds"):
        setErrorMessage("");
        break;
      default:
        return;
    }
  };
  return (
    <div className={authStyle.bg}>
      <form onSubmit={(e) => login(e)} className={authStyle.auth}>
        <h1 className={authStyle.title}>{t("login.title")}</h1>
        <div className={authStyle["wrapper-input"]}>
          <label htmlFor="username" className={authStyle["input-label"]}>
            {t("login.username")}
          </label>
          <input
            type="text"
            name="username"
            className={authStyle["input-text"]}
            onChange={handleChange}
          />
          <div className={authStyle["wrapper-password-text"]}>
            <label htmlFor="password" className={authStyle["input-label"]}>
              {t("login.password")}
            </label>
            <span className={authStyle.tooltip}>
              ?
              <span className={authStyle.tooltiptext}>
                {t("login.tooltip")}
              </span>
            </span>
          </div>
          <input
            type="password"
            name="password"
            className={authStyle["input-text"]}
            onChange={handleChange}
          />
        </div>
        {errorMessage === "" ? null : <ErrorMessage message={errorMessage!} />}
        <span className={buttons["wrapper-btns"]}>
          <button type="submit" className={buttons["btn-open"]}>
            {t("login.loginBtn")}
          </button>
          <button
            className={buttons["btn-cancel"]}
            onClick={() => navigate("/")}
          >
            {t("login.homeBtn")}
          </button>
        </span>
      </form>
    </div>
  );
};

export default Login;
