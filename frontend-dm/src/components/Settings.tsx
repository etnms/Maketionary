import DarkThemeToggle from "./Settings/DarkThemeToggle";
import pageStyles from "../styles/PageOverlay.module.css";
import styles from "./Settings.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import Toggle from "./Settings/Toggle";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { setInLineDisplay } from "../features/settingsSlice";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate: NavigateFunction = useNavigate();
  
  useEffect(() => {
    const languageValue: string | null = localStorage.getItem("i18nextLng") || "en";
    (document.querySelector("select[name='language-select']") as HTMLSelectElement).value = languageValue;
  });

  // Add escape button handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/dashboard");
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [navigate]);

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.currentTarget.value);
  };

  return (
    <div className={pageStyles.page} data-settings="settings-menu">
      <div className={pageStyles.box} data-settings="btn-close-settings">
        <button onClick={() => navigate("/dashboard")} className={pageStyles["btn-close"]}>
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
        <Toggle
          title={t("settings.display")}
          beforeText={t("settings.inLine")}
          afterText={t("settings.column")}
          name={"toggle-inline"}
          setting={"inline-display"}
          defaultValue={false}
          stateFunction={setInLineDisplay}></Toggle>
      </div>
    </div>
  );
};

export default Settings;
