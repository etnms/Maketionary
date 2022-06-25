import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProjectMenu.module.css";
import buttons from "../styles/Buttons.module.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";

const NewProjectMenu = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string>("");
  // Show loader component variable
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = t("pageTitles.newProject");

    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");
  });

  const createNewProject = (e: React.FormEvent<HTMLFormElement>) => {
    // show loading screen
    setLoading(true);

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
        // Hide loading screen
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((err) => {
        // Hide loading screen
        setLoading(false);
        if (err.response.status === 403) return navigate("/expired")
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
        {!loading ? (
          <div className={buttons["wrapper-btns"]}>
            <button type="submit" className={buttons["btn-open"]}>
              {t("projects.createBtn")}
            </button>
            <button type="submit" className={buttons["btn-cancel"]} onClick={() => navigate("/dashboard")}>
              {t("projects.cancelBtn")}
            </button>
          </div>
        ) : (
          <Loader width={24} height={24}/>
        )}
      </form>
    </div>
  );
};

export default NewProjectMenu;
