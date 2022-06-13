import DarkThemeToggle from "./DarkThemeToggle";
import styles from "./Settings.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Toggle from "./settings/Toggle";

const Settings = () => {
  const { t, i18n } = useTranslation();

  const closeSettings = () => {
    const settings = document.querySelector("[data-settings='settings-menu']");
    settings?.classList.remove(`${styles["show-settings"]}`);
  };

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.currentTarget.value);
  };

  useEffect(() => {
    const languageValue = localStorage.getItem("i18nextLng") || "en";
    (document.querySelector("select[name='language-select']") as HTMLSelectElement).value = languageValue;
  });

  return (
    <div className={styles.settings} data-settings="settings-menu">
      <div className={styles["settings-box"]} data-settings="btn-close-settings">
        <button onClick={() => closeSettings()} className={styles["btn-close"]}>
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
          <span>{t("settings.autoOpenProject")}</span>
        </Toggle>
        <Toggle name={"toggle-autosign"} settings={"autosign"} value={"true"}>
          <span>{t("settings.userSignin")}</span>
        </Toggle>
      </div>
    </div>
  );
};

export default Settings;
