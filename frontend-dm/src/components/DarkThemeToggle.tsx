import styles from "./DarkThemeToggle.module.css";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
const DarkThemeToggle = () => {

  const toggleDarkTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((e.target as HTMLInputElement).checked) {
        document.documentElement.setAttribute("data-color-scheme", "dark");
        localStorage.setItem("darktheme", "darktheme");
      } else {
        localStorage.setItem("darktheme", "lighttheme");
        document.documentElement.setAttribute("data-color-scheme", "light");
      }
  };

  return (
    <div className={styles["dark-theme-toggle"]}>
      <LightModeIcon />
      <label className={styles.switch}>
        <input type="checkbox" name="toggle-darktheme" onChange={(e) => toggleDarkTheme(e)}/>
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <DarkModeIcon />
    </div>
  );
};

export default DarkThemeToggle;
