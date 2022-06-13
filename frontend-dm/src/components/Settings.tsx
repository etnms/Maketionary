import DarkThemeToggle from "./settings/DarkThemeToggle";
import styles from "./Settings.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import Toggle from "./settings/Toggle";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const languageValue = localStorage.getItem("i18nextLng") || "en";
    (document.querySelector("select[name='language-select']") as HTMLSelectElement).value = languageValue;
  });

  // Add escape button handler
  useEffect(()=> {
    const  handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/dashboard");
     }
   };
   window.addEventListener('keydown',  handleEscape);

   return () => {
     window.removeEventListener('keydown',  handleEscape);
   };
  }, [navigate])

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.currentTarget.value);
  };

  return (
    <div className={styles.settings} data-settings="settings-menu" >
      <div className={styles["settings-box"]} data-settings="btn-close-settings" >
        <button onClick={() => navigate("/dashboard")} className={styles["btn-close"]}>
          <CloseIcon />
        </button>
        <h1 className={styles.title}>{t("settings.title")}</h1>
        <div className={styles["wrapper-theme"]}>
          <p>{t("settings.theme")}</p>
          <DarkThemeToggle />
        </div>
        <div className={styles["wrapper-language"]}>
          <p>{t("settings.language")}</p>
          <select
            name="language-select"
            className={styles["language-select"]}
            onChange={(e) => changeLanguage(e)}>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <Toggle name={"toggle-previous"} settings={"previous-project"} value={"true"}>
          <span>In line display</span>
        </Toggle>
      </div>
    </div>
  );
};

export default Settings;
