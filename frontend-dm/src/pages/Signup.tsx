import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authStyle from "../styles/Login.module.css";
import buttons from "../styles/Buttons.module.css";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../components/ErrorMessage";

const Signup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    document.title = t("pageTitles.signup");
    // Toggle darktheme
    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");
  });

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
          // Remove project parameters for new connexion
          localStorage.removeItem("project");
          localStorage.removeItem("projectName");
          // Save token
          localStorage.setItem("token", res.data.token);
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        switch (err.response.data) {
          case "Empty username":
            return setErrorMessage(t("errorMessages.errorEmptyUsername"));
          case "There was a problem":
            return setErrorMessage(t("errorMessages.errorProblem"));
          case "Username already exists":
            return setErrorMessage(t("errorMessages.errorExistingUsername"));
          case "Email already exists":
            return setErrorMessage(t("errorMessages.errorExistingEmail"));
          case "email":
            return setErrorMessage(t("errorMessages.errorEmptyEmail"));
          case "password":
            return setErrorMessage(t("errorMessages.errorPasswordLength"));
          case "Passwords special characters":
            return setErrorMessage(t("errorMessages.errorPasswordCharacters"));
          case "Passwords need to match":
            return setErrorMessage(t("errorMessages.errorPasswordMatch"));
          case "Invalid email":
            return setErrorMessage(t("errorMessages.errorInvalidEmail"))
          default:
            return setErrorMessage(t("errorMessages.errorProblem"));
        }
      });
  };

  // Handle change to check if fields corresponds to their supposed values
  const handleChange = () => {
    const email = (document.querySelector("input[name='email']") as HTMLInputElement).value;
    const username = (document.querySelector("input[name='username']") as HTMLInputElement).value;
    const password = (document.querySelector("input[name='password']") as HTMLInputElement).value;
    const confirmPassword = (document.querySelector("input[name='confirm-password']") as HTMLInputElement)
      .value;
    switch (errorMessage) {
      case t("errorMessages.errorEmptyUsername"):
        if (username !== "") setErrorMessage("");
        break;
      case t("errorMessages.errorPasswordMatch"):
        if (password === confirmPassword) setErrorMessage("");
        break;
      case t("errorMessages.errorEmptyEmail"):
        if (email !== "") setErrorMessage("");
        break;
      case t("errorMessages.errorPasswordLength"):
        if (password.length > 6) setErrorMessage("");
        break;
      case t("errorMessages.errorPasswordCharacters"):
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
      <form onSubmit={(e) => signup(e)} className={authStyle.auth}>
        <h1 className={authStyle.title}>{t("signup.title")}</h1>
        <div className={authStyle["wrapper-input"]}>
          <label htmlFor="email" className={authStyle["input-label"]}>
            {t("signup.email")}
          </label>
          <input
            type="email"
            name="email"
            className={authStyle["input-text"]}
            onChange={() => handleChange()}
          />
          <label htmlFor="username" className={authStyle["input-label"]}>
            {t("signup.username")}
          </label>
          <input
            type="text"
            name="username"
            className={authStyle["input-text"]}
            onChange={() => handleChange()}
          />
          <div className={authStyle["wrapper-password-text"]}>
            <label htmlFor="password" className={authStyle["input-label"]}>
              {t("signup.password")}
            </label>
            <span className={authStyle.tooltip}>
              ?<span className={authStyle.tooltiptext}>{t("signup.tooltip")}</span>
            </span>
          </div>
          <input
            type="password"
            name="password"
            className={authStyle["input-text"]}
            onChange={() => handleChange()}
          />
          <label htmlFor="confirm-password" className={authStyle["input-label"]}>
            {t("signup.confirmPassword")}
          </label>
          <input
            type="password"
            name="confirm-password"
            className={authStyle["input-text"]}
            onChange={() => handleChange()}
          />
        </div>
        {errorMessage === "" ? null : <ErrorMessage message={errorMessage} />}
        <span className={buttons["wrapper-btns"]}>
          <button type="submit" className={buttons["btn-open"]}>
            {t("signup.signupBtn")}
          </button>
          <button className={buttons["btn-cancel"]} onClick={() => navigate("/")}>
            {t("signup.homeBtn")}
          </button>
        </span>
      </form>
    </div>
  );
};

export default Signup;
