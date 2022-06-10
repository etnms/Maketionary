import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProjectMenu.module.css";
import buttons from "../styles/Buttons.module.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../components/ErrorMessage";

const NewProjectMenu = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    document.title = t("pageTitles.newProject");

    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");
  });

  const createNewProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const language = (document.querySelector("input[name='newproject']") as HTMLInputElement).value;
    axios
      .post(
        `${process.env.REACT_APP_BACKEND}/api/language`,
        { language },
        { headers: { Authorization: token! } }
      )
      .then((res) => {
        localStorage.setItem("project", res.data._id);
        localStorage.setItem("projectName", res.data.name);
        navigate("/");
      })
      .catch((err) => {
        switch (err.response.data) {
          case "Name too long":
            return setErrorMessage(t("errorMessages.errorNameTooLong"));
          case "Error field empty":
            return setErrorMessage(t("errorMessages.errorProjectNameEmpty"));
          case "Error creation collection":
            return setErrorMessage(t("errorMessages.errorProblem"));
          default:
            return setErrorMessage(t("errorMessages.errorProblem"));
        }
      });
  };

  // Handle change to check if fields corresponds to their supposed values
  const handleChange = () => {
    const language = (document.querySelector("input[name='newproject']") as HTMLInputElement).value;

    switch (errorMessage) {
      case t("errorMessages.errorProjectNameEmpty"):
        if (language !== "") setErrorMessage("");
        break;
      case t("errorMessages.errorNameTooLong"):
        if (language.length < 30) setErrorMessage("");
        break;
      default:
        return;
    }
  };

  return (
    <div className={styles.menu}>
      <form className={styles["form-new-project"]} onSubmit={(e) => createNewProject(e)}>
        <label htmlFor="newproject" className={styles.label}>
          {t("projects.newProjectTitle")}
        </label>
        <input name="newproject" className={styles.input} onChange={handleChange} />
        {errorMessage === "" ? null : <ErrorMessage message={errorMessage} />}
        <div className={buttons["wrapper-btns"]}>
          <button type="submit" className={buttons["btn-open"]}>
            {t("projects.createBtn")}
          </button>
          <button type="submit" className={buttons["btn-cancel"]} onClick={() => navigate("/")}>
            {t("projects.cancelBtn")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectMenu;
