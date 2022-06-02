import DarkThemeToggle from "./DarkThemeToggle";
import styles from "./Settings.module.css";
import CloseIcon from "@mui/icons-material/Close";

const Settings = () => {
  const closeSettings = () => {
    const settings = document.querySelector("[data-settings='settings-menu']");
    settings?.classList.remove(`${styles["show-settings"]}`);
  };

  return (
    <div className={styles.settings} data-settings="settings-menu">
      <div className={styles["settings-box"]} data-settings="btn-close-settings">
        <h1 className={styles.title}>Settings</h1>
        <div className={styles["wrapper-theme"]}>
          <p>Theme</p>
          <DarkThemeToggle />
        </div>

        <div className={styles["wrapper-language"]}>
          <p>Language</p>
          <select className={styles["language-select"]}>
            <option>English</option>
            <option>French</option>
          </select>
        </div>
        <button onClick={() => closeSettings()} className={styles["btn-close"]}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default Settings;
